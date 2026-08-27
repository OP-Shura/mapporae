'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { PlaceList, SavedPlaceItem, UserProfile } from '@/lib/types';
import { getSupabaseBrowserClient, isSupabaseConfigured } from '@/lib/supabase/client';
import { logger } from '@/lib/logger';
import { sanitizeText } from '@/lib/security/sanitize';

export const DEFAULT_LISTS: PlaceList[] = [
  {
    id: 'must-visit',
    name: 'Must Visit',
    description: 'Iconic heritage landmarks, ancient temples, and main ghats of Kashi.',
    iconName: 'Sparkles',
    isDefault: true,
    createdAt: '2026-08-20T00:00:00Z',
  },
  {
    id: 'food-spots',
    name: 'Food Spots',
    description: 'Legendary chaat shops, rabri lassi, kachori gali, and sweet shops.',
    iconName: 'Utensils',
    isDefault: true,
    createdAt: '2026-08-20T00:00:00Z',
  },
  {
    id: 'weekend-plan',
    name: 'Weekend Plan',
    description: 'A curated itinerary for sunrise boat rides and evening Ganga Aarti.',
    iconName: 'Calendar',
    isDefault: true,
    createdAt: '2026-08-20T00:00:00Z',
  },
  {
    id: 'essentials',
    name: 'Essentials',
    description: 'Emergency contacts, curated pharmacies, and 24/7 ATM points.',
    iconName: 'Shield',
    isDefault: true,
    createdAt: '2026-08-20T00:00:00Z',
  }
];

const INITIAL_SAVED_PLACES: SavedPlaceItem[] = [
  { placeId: 'dashashwamedh-ghat', listId: 'must-visit', savedAt: '2026-08-22T10:00:00Z', notes: 'Best spot for evening 6:30 PM Aarti' },
  { placeId: 'kashi-vishwanath-temple', listId: 'must-visit', savedAt: '2026-08-22T10:05:00Z', notes: 'Visit corridor early morning' },
  { placeId: 'kashi-chaat-bhandar', listId: 'food-spots', savedAt: '2026-08-22T10:10:00Z', notes: 'Must try Tamatar Chaat and Gulab Jamun' },
  { placeId: 'assi-ghat', listId: 'weekend-plan', savedAt: '2026-08-22T10:15:00Z', notes: 'Subah-e-Banaras morning sunrise' }
];

export type SupabaseConnectionStatus = 'unconfigured' | 'unavailable' | 'ready' | 'connected';

interface SavedPlacesContextType {
  user: UserProfile | null;
  lists: PlaceList[];
  savedItems: SavedPlaceItem[];
  activeListId: string;
  setActiveListId: (id: string) => void;
  savePlace: (placeId: string, listId?: string, notes?: string) => Promise<void>;
  removeSavedPlace: (placeId: string, listId?: string) => Promise<void>;
  isPlaceSaved: (placeId: string, listId?: string) => boolean;
  createList: (name: string, description?: string, iconName?: string) => Promise<string>;
  deleteList: (listId: string) => Promise<void>;
  getPlaceLists: (placeId: string) => string[];
  totalSavedCount: number;
  isCloudSyncing: boolean;
  isSupabaseAvailable: boolean;
  connectionStatus: SupabaseConnectionStatus;
  connectionMessage: string;
  hasLocalDataToImport: boolean;
  importLocalDataToCloud: () => Promise<{ success: boolean; count: number }>;
  signOut: () => Promise<void>;
  syncError: string | null;
  clearSyncError: () => void;
}

const SavedPlacesContext = createContext<SavedPlacesContextType | undefined>(undefined);

const STORAGE_KEY_LISTS = 'mapporae_lists_v1';
const STORAGE_KEY_SAVED = 'mapporae_saved_v1';

export function SavedPlacesProvider({ children }: { children: React.ReactNode }) {
  // Local storage state (anonymous & offline fallback)
  const [localLists, setLocalLists] = useState<PlaceList[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(STORAGE_KEY_LISTS);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
      } catch {
        // Use default
      }
    }
    return DEFAULT_LISTS;
  });

  const [localSavedItems, setLocalSavedItems] = useState<SavedPlaceItem[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(STORAGE_KEY_SAVED);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed)) return parsed;
        }
      } catch {
        // Use initial
      }
    }
    return INITIAL_SAVED_PLACES;
  });

  // Cloud state
  const [user, setUser] = useState<UserProfile | null>(null);
  const [cloudLists, setCloudLists] = useState<PlaceList[]>([]);
  const [cloudSavedItems, setCloudSavedItems] = useState<SavedPlaceItem[]>([]);
  const [activeListId, setActiveListId] = useState<string>('must-visit');
  const [isCloudSyncing, setIsCloudSyncing] = useState<boolean>(false);
  const [syncError, setSyncError] = useState<string | null>(null);
  const [hasLocalDataToImport, setHasLocalDataToImport] = useState<boolean>(false);
  const [connectionStatus, setConnectionStatus] = useState<SupabaseConnectionStatus>(() =>
    isSupabaseConfigured ? 'ready' : 'unconfigured'
  );

  // Active view lists & items: Use cloud data ONLY when connected; fallback to local data if unavailable
  const lists = (user && connectionStatus === 'connected') ? cloudLists : localLists;
  const savedItems = (user && connectionStatus === 'connected') ? cloudSavedItems : localSavedItems;

  // Persist local state whenever updated (offline resilience)
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_LISTS, JSON.stringify(localLists));
      localStorage.setItem(STORAGE_KEY_SAVED, JSON.stringify(localSavedItems));
    } catch {
      // LocalStorage unavailable
    }
  }, [localLists, localSavedItems]);

  // Load cloud data for authenticated user
  const fetchCloudData = useCallback(async (userId: string) => {
    const supabase = getSupabaseBrowserClient();
    if (!supabase) return;

    setIsCloudSyncing(true);
    setSyncError(null);

    try {
      // 1. Fetch user lists
      const { data: dbLists, error: listError } = await supabase
        .from('place_lists')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: true });

      if (listError) throw listError;

      let activeLists: PlaceList[] = [];

      // If user has no lists in cloud, provision default lists
      if (!dbLists || dbLists.length === 0) {
        const defaultToInsert = DEFAULT_LISTS.map(l => ({
          user_id: userId,
          name: l.name,
          description: l.description,
          icon_name: l.iconName,
        }));

        const { data: inserted, error: insertErr } = await supabase
          .from('place_lists')
          .insert(defaultToInsert)
          .select();

        if (insertErr) throw insertErr;

        activeLists = (inserted || []).map(row => ({
          id: row.id,
          name: row.name,
          description: row.description || '',
          iconName: row.icon_name || 'Bookmark',
          isDefault: DEFAULT_LISTS.some(d => d.name === row.name),
          createdAt: row.created_at || new Date().toISOString(),
        }));
      } else {
        activeLists = dbLists.map(row => ({
          id: row.id,
          name: row.name,
          description: row.description || '',
          iconName: row.icon_name || 'Bookmark',
          isDefault: DEFAULT_LISTS.some(d => d.name === row.name),
          createdAt: row.created_at || new Date().toISOString(),
        }));
      }

      setCloudLists(activeLists);
      if (activeLists.length > 0) {
        setActiveListId(activeLists[0].id);
      }

      // 2. Fetch saved places
      const { data: dbSaved, error: savedError } = await supabase
        .from('saved_places')
        .select('*')
        .eq('user_id', userId)
        .order('saved_at', { ascending: false });

      if (savedError) throw savedError;

      const activeSaved: SavedPlaceItem[] = (dbSaved || []).map(row => ({
        id: row.id,
        placeId: row.place_id,
        listId: row.list_id,
        notes: row.notes || undefined,
        savedAt: row.saved_at || new Date().toISOString(),
      }));

      setCloudSavedItems(activeSaved);
      setConnectionStatus('connected');
      logger.info('Synchronized saved places from Supabase', { component: 'SavedPlacesContext', count: activeSaved.length });

      // 3. Detect if unimported local data exists
      if (localSavedItems.length > 0 && activeSaved.length === 0) {
        setHasLocalDataToImport(true);
      } else {
        const unimported = localSavedItems.filter(
          local => !activeSaved.some(cloud => cloud.placeId === local.placeId)
        );
        setHasLocalDataToImport(unimported.length > 0);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to synchronize with Supabase';
      logger.warn(`Supabase synchronization error: ${msg}`, { component: 'SavedPlacesContext', error: msg });
      setSyncError(msg);
      setConnectionStatus('unavailable');
    } finally {
      setIsCloudSyncing(false);
    }
  }, [localSavedItems]);

  // Listen to Supabase Auth state changes
  useEffect(() => {
    const supabase = getSupabaseBrowserClient();
    if (!supabase || !isSupabaseConfigured) {
      return;
    }

    // Verify connection & active session on mount
    supabase.auth.getUser().then(({ data: { user: authUser }, error }) => {
      if (error) {
        if (error.message.includes('fetch') || error.status === 500) {
          logger.warn(`Supabase connection failed: ${error.message}`, { component: 'SavedPlacesContext' });
          setConnectionStatus('unavailable');
        } else {
          setConnectionStatus('ready');
        }
      } else if (authUser) {
        setUser({
          id: authUser.id,
          email: authUser.email,
          displayName: authUser.user_metadata?.display_name || authUser.email?.split('@')[0],
          avatarUrl: authUser.user_metadata?.avatar_url,
        });
        fetchCloudData(authUser.id);
      } else {
        setConnectionStatus('ready');
      }
    }).catch((err) => {
      logger.warn(`Supabase auth verification failed`, { component: 'SavedPlacesContext', error: err });
      setConnectionStatus('unavailable');
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          setUser({
            id: session.user.id,
            email: session.user.email,
            displayName: session.user.user_metadata?.display_name || session.user.email?.split('@')[0],
            avatarUrl: session.user.user_metadata?.avatar_url,
          });
          fetchCloudData(session.user.id);
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          setCloudLists([]);
          setCloudSavedItems([]);
          setHasLocalDataToImport(false);
          setActiveListId('must-visit');
          setConnectionStatus('ready');
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [fetchCloudData]);

  // Save place
  const savePlace = async (placeId: string, listId?: string, notes?: string) => {
    const targetListId = listId ? sanitizeText(listId, 50) : (lists[0]?.id ?? 'must-visit');
    const sanitizedNotes = notes ? sanitizeText(notes, 500) : undefined;
    const cleanPlaceId = sanitizeText(placeId, 100);

    // Always preserve locally so no data is lost
    setLocalSavedItems(prev => {
      const exists = prev.some(item => item.placeId === cleanPlaceId && item.listId === targetListId);
      if (exists) return prev;
      return [{ placeId: cleanPlaceId, listId: targetListId, savedAt: new Date().toISOString(), notes: sanitizedNotes }, ...prev];
    });

    // If anonymous or offline, local update is complete
    if (!user || connectionStatus !== 'connected') {
      return;
    }

    // Cloud Save for signed-in user
    const tempId = 'temp-' + Date.now();
    const optimisticItem: SavedPlaceItem = {
      id: tempId,
      placeId: cleanPlaceId,
      listId: targetListId,
      savedAt: new Date().toISOString(),
      notes: sanitizedNotes,
    };

    setCloudSavedItems(prev => {
      if (prev.some(item => item.placeId === cleanPlaceId && item.listId === targetListId)) return prev;
      return [optimisticItem, ...prev];
    });

    const supabase = getSupabaseBrowserClient();
    if (!supabase) return;

    try {
      const { data, error } = await supabase
        .from('saved_places')
        .insert({
          user_id: user.id,
          place_id: cleanPlaceId,
          list_id: targetListId,
          notes: sanitizedNotes || null,
        })
        .select()
        .single();

      if (error) throw error;

      if (data) {
        setCloudSavedItems(prev =>
          prev.map(item => (item.id === tempId ? { ...item, id: data.id } : item))
        );
      }
    } catch (err: unknown) {
      setCloudSavedItems(prev => prev.filter(item => item.id !== tempId));
      const msg = err instanceof Error ? err.message : 'Could not save place to cloud.';
      logger.error('Error saving place to Supabase, falling back to local copy', err, { component: 'SavedPlacesContext', placeId: cleanPlaceId });
      setSyncError(msg);
      setConnectionStatus('unavailable');
    }
  };

  // Remove saved place
  const removeSavedPlace = async (placeId: string, listId?: string) => {
    const cleanPlaceId = sanitizeText(placeId, 100);
    const cleanListId = listId ? sanitizeText(listId, 50) : undefined;

    // Always update local copy
    setLocalSavedItems(prev => {
      if (cleanListId) {
        return prev.filter(item => !(item.placeId === cleanPlaceId && item.listId === cleanListId));
      }
      return prev.filter(item => item.placeId !== cleanPlaceId);
    });

    if (!user || connectionStatus !== 'connected') {
      return;
    }

    // Cloud removal with optimistic state
    const previousCloudItems = [...cloudSavedItems];
    setCloudSavedItems(prev => {
      if (cleanListId) {
        return prev.filter(item => !(item.placeId === cleanPlaceId && item.listId === cleanListId));
      }
      return prev.filter(item => item.placeId !== cleanPlaceId);
    });

    const supabase = getSupabaseBrowserClient();
    if (!supabase) return;

    try {
      let query = supabase.from('saved_places').delete().eq('user_id', user.id).eq('place_id', cleanPlaceId);
      if (cleanListId) {
        query = query.eq('list_id', cleanListId);
      }
      const { error } = await query;
      if (error) throw error;
    } catch (err: unknown) {
      setCloudSavedItems(previousCloudItems);
      const msg = err instanceof Error ? err.message : 'Could not delete place from cloud.';
      logger.error('Error deleting place from Supabase', err, { component: 'SavedPlacesContext', placeId: cleanPlaceId });
      setSyncError(msg);
      setConnectionStatus('unavailable');
    }
  };

  // Create new list
  const createList = async (name: string, description: string = '', iconName: string = 'Bookmark'): Promise<string> => {
    const cleanName = sanitizeText(name, 50);
    const cleanDescription = sanitizeText(description, 200);
    const cleanIcon = sanitizeText(iconName, 30) || 'Bookmark';

    const localId = cleanName.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now().toString().slice(-4);
    const newLocalList: PlaceList = {
      id: localId,
      name: cleanName,
      description: cleanDescription,
      iconName: cleanIcon,
      isDefault: false,
      createdAt: new Date().toISOString(),
    };
    setLocalLists(prev => [...prev, newLocalList]);

    if (!user || connectionStatus !== 'connected') {
      return localId;
    }

    const supabase = getSupabaseBrowserClient();
    if (!supabase) {
      return localId;
    }

    try {
      const { data, error } = await supabase
        .from('place_lists')
        .insert({
          user_id: user.id,
          name: cleanName,
          description: cleanDescription || null,
          icon_name: cleanIcon,
        })
        .select()
        .single();

      if (error || !data) {
        throw error || new Error('Failed to insert list in Supabase');
      }

      const newCloudList: PlaceList = {
        id: data.id,
        name: data.name,
        description: data.description || '',
        iconName: data.icon_name || 'Bookmark',
        isDefault: false,
        createdAt: data.created_at || new Date().toISOString(),
      };

      setCloudLists(prev => [...prev, newCloudList]);
      return data.id;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to create list in cloud';
      logger.error('Error creating list in Supabase, preserved in local storage', err, { component: 'SavedPlacesContext', name });
      setSyncError(msg);
      setConnectionStatus('unavailable');
      return localId;
    }
  };

  // Delete list
  const deleteList = async (listId: string) => {
    // Always update local copy
    if (!DEFAULT_LISTS.some(l => l.id === listId)) {
      setLocalLists(prev => prev.filter(l => l.id !== listId));
      setLocalSavedItems(prev => prev.filter(item => item.listId !== listId));
      if (activeListId === listId) setActiveListId('must-visit');
    }

    if (!user || connectionStatus !== 'connected') {
      return;
    }

    const supabase = getSupabaseBrowserClient();
    if (!supabase) return;

    const previousLists = [...cloudLists];
    const previousItems = [...cloudSavedItems];

    setCloudLists(prev => prev.filter(l => l.id !== listId));
    setCloudSavedItems(prev => prev.filter(item => item.listId !== listId));
    if (activeListId === listId && cloudLists.length > 0) {
      setActiveListId(cloudLists[0].id);
    }

    try {
      const { error } = await supabase
        .from('place_lists')
        .delete()
        .eq('id', listId)
        .eq('user_id', user.id);

      if (error) throw error;
    } catch (err: unknown) {
      setCloudLists(previousLists);
      setCloudSavedItems(previousItems);
      const msg = err instanceof Error ? err.message : 'Failed to delete list from cloud';
      logger.error('Error deleting list from Supabase', err, { component: 'SavedPlacesContext', listId });
      setSyncError(msg);
      setConnectionStatus('unavailable');
    }
  };

  // Correct One-Time Local Data Import (Creates missing cloud lists & maps exactly)
  const importLocalDataToCloud = async (): Promise<{ success: boolean; count: number }> => {
    if (!user || localSavedItems.length === 0) {
      return { success: true, count: 0 };
    }

    const supabase = getSupabaseBrowserClient();
    if (!supabase) {
      return { success: false, count: 0 };
    }

    setIsCloudSyncing(true);
    let importedCount = 0;

    try {
      // 1. Fetch current cloud lists
      const { data: latestDbLists, error: listFetchErr } = await supabase
        .from('place_lists')
        .select('*')
        .eq('user_id', user.id);

      if (listFetchErr) throw listFetchErr;

      const currentCloudLists: PlaceList[] = (latestDbLists || []).map(row => ({
        id: row.id,
        name: row.name,
        description: row.description || '',
        iconName: row.icon_name || 'Bookmark',
        isDefault: DEFAULT_LISTS.some(d => d.name === row.name),
        createdAt: row.created_at || new Date().toISOString(),
      }));

      // 2. Build localListId -> cloudListId mapping (create missing custom lists in cloud first)
      const localToCloudListMap = new Map<string, string>();

      for (const localList of localLists) {
        let matchedCloudList = currentCloudLists.find(
          cl => cl.name.trim().toLowerCase() === localList.name.trim().toLowerCase()
        );

        if (!matchedCloudList) {
          // Create the missing list in Supabase
          const cleanListName = sanitizeText(localList.name, 50);
          const cleanListDesc = sanitizeText(localList.description, 200);
          const cleanListIcon = sanitizeText(localList.iconName, 30) || 'Bookmark';

          const { data: insertedList, error: insertListErr } = await supabase
            .from('place_lists')
            .insert({
              user_id: user.id,
              name: cleanListName,
              description: cleanListDesc || null,
              icon_name: cleanListIcon,
            })
            .select()
            .single();

          if (insertListErr || !insertedList) {
            throw insertListErr || new Error(`Failed to provision cloud list "${cleanListName}"`);
          }

          matchedCloudList = {
            id: insertedList.id,
            name: insertedList.name,
            description: insertedList.description || '',
            iconName: insertedList.icon_name || 'Bookmark',
            isDefault: DEFAULT_LISTS.some(d => d.name === insertedList.name),
            createdAt: insertedList.created_at || new Date().toISOString(),
          };

          currentCloudLists.push(matchedCloudList);
        }

        if (matchedCloudList) {
          localToCloudListMap.set(localList.id, matchedCloudList.id);
        }
      }

      // 3. Fetch existing saved places in cloud
      const { data: existingDbSaved, error: savedFetchErr } = await supabase
        .from('saved_places')
        .select('*')
        .eq('user_id', user.id);

      if (savedFetchErr) throw savedFetchErr;

      const existingSavedItems = existingDbSaved || [];

      // 4. Import each local place into its precisely mapped cloud list
      for (const localItem of localSavedItems) {
        const targetCloudListId = localToCloudListMap.get(localItem.listId);
        if (!targetCloudListId) continue;

        const cleanPlaceId = sanitizeText(localItem.placeId, 100);
        const cleanNotes = localItem.notes ? sanitizeText(localItem.notes, 500) : null;

        const alreadyInCloud = existingSavedItems.some(
          cs => cs.place_id === cleanPlaceId && cs.list_id === targetCloudListId
        );

        if (!alreadyInCloud) {
          const { error: insertSavedErr } = await supabase.from('saved_places').insert({
            user_id: user.id,
            place_id: cleanPlaceId,
            list_id: targetCloudListId,
            notes: cleanNotes,
          });

          if (!insertSavedErr) {
            importedCount++;
          }
        }
      }

      // 5. Reload full cloud data and clear import prompt
      await fetchCloudData(user.id);
      setHasLocalDataToImport(false);
      logger.info(`Imported ${importedCount} local places to cloud with custom lists mapped`, { component: 'SavedPlacesContext' });
      return { success: true, count: importedCount };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Import failed';
      logger.error('Failed to import local places to cloud', err, { component: 'SavedPlacesContext' });
      setSyncError(msg);
      return { success: false, count: importedCount };
    } finally {
      setIsCloudSyncing(false);
    }
  };

  // Sign out
  const signOut = async () => {
    const supabase = getSupabaseBrowserClient();
    if (supabase) {
      await supabase.auth.signOut();
    }
    setUser(null);
    setCloudLists([]);
    setCloudSavedItems([]);
    setHasLocalDataToImport(false);
    setActiveListId('must-visit');
    setConnectionStatus('ready');
    logger.info('User signed out, switched to local storage mode', { component: 'SavedPlacesContext' });
  };

  const isPlaceSaved = (placeId: string, listId?: string): boolean => {
    if (listId) {
      return savedItems.some(item => item.placeId === placeId && item.listId === listId);
    }
    return savedItems.some(item => item.placeId === placeId);
  };

  const getPlaceLists = (placeId: string): string[] => {
    return savedItems.filter(item => item.placeId === placeId).map(item => item.listId);
  };

  const clearSyncError = () => setSyncError(null);

  const totalSavedCount = new Set(savedItems.map(i => i.placeId)).size;

  // Derived connection validation message
  let connectionMessage = 'Offline mode — saved places stay on this device.';
  if (connectionStatus === 'connected') {
    connectionMessage = 'Cloud sync active.';
  } else if (connectionStatus === 'unavailable') {
    connectionMessage = 'Cloud sync is unavailable. Your saved places remain safely stored on this device.';
  } else if (connectionStatus === 'ready') {
    connectionMessage = 'Offline mode — saved places stay on this device.';
  }

  return (
    <SavedPlacesContext.Provider
      value={{
        user,
        lists,
        savedItems,
        activeListId,
        setActiveListId,
        savePlace,
        removeSavedPlace,
        isPlaceSaved,
        createList,
        deleteList,
        getPlaceLists,
        totalSavedCount,
        isCloudSyncing,
        isSupabaseAvailable: isSupabaseConfigured,
        connectionStatus,
        connectionMessage,
        hasLocalDataToImport,
        importLocalDataToCloud,
        signOut,
        syncError,
        clearSyncError,
      }}
    >
      {children}
    </SavedPlacesContext.Provider>
  );
}

export function useSavedPlaces() {
  const context = useContext(SavedPlacesContext);
  if (!context) {
    throw new Error('useSavedPlaces must be used within a SavedPlacesProvider');
  }
  return context;
}
