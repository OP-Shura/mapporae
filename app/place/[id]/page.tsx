import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getPlaceById, getRelatedPlaces } from '@/lib/api/places';
import { StatusBadge, OpenBadge } from '@/components/ui/Badge';
import { VisitorTipCard } from '@/components/place/VisitorTipCard';
import { MiniMapPreview } from '@/components/map/MiniMapPreview';
import { PlaceDetailsClient } from './PlaceDetailsClient';
import { 
  MapPin, 
  Clock, 
  Star, 
  ArrowLeft, 
  Ticket, 
  CheckCircle2,
  ExternalLink
} from 'lucide-react';

interface PlacePageProps {
  params: Promise<{ id: string }>;
}

export default async function PlaceDetailsPage({ params }: PlacePageProps) {
  const { id } = await params;
  const place = await getPlaceById(id);

  if (!place) {
    notFound();
  }

  const relatedPlaces = await getRelatedPlaces(place.id, 3);

  return (
    <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 space-y-8">
      {/* Breadcrumb & Navigation */}
      <div className="flex items-center justify-between">
        <Link
          href="/explore"
          className="inline-flex items-center gap-1.5 rounded-xl border border-[#E8D9C0] bg-white px-3.5 py-1.5 text-xs font-semibold text-[#172554] shadow-xs hover:border-[#0E7490] hover:text-[#0E7490] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Explore</span>
        </Link>

        <div className="flex items-center gap-2">
          <StatusBadge
            status={place.status}
            sourceUrl={place.sourceUrl}
            verifiedAt={place.verifiedAt}
          />
          <OpenBadge isOpen={place.openNow} />
        </div>
      </div>

      {/* Hero Cover Image & Title Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-[#E8D9C0] bg-slate-900 shadow-lg">
        <div className="relative h-72 sm:h-96 w-full">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={place.coverImage}
            alt={place.name}
            className="h-full w-full object-cover opacity-90"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

          {/* Bottom Title Overlay */}
          <div className="absolute bottom-6 left-6 right-6 text-white space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-[#0E7490] px-3 py-0.5 text-xs font-bold uppercase tracking-wider text-white">
                {place.category}
              </span>
              {place.subCategory && (
                <span className="rounded-full bg-white/20 backdrop-blur-md px-2.5 py-0.5 text-xs font-medium text-slate-200">
                  {place.subCategory}
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              {place.name}
            </h1>

            {place.hindiName && (
              <p className="text-sm sm:text-base font-medium text-slate-300">
                {place.hindiName}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Interactive Action Bar (Client component for GPS, Save, Share) */}
      <PlaceDetailsClient place={place} />

      {/* Main Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left Column: Description, Highlights, Visitor Tips */}
        <div className="lg:col-span-2 space-y-6">
          {/* Key Facts Summary Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="rounded-2xl border border-[#E8D9C0] bg-white p-3.5 shadow-xs">
              <div className="flex items-center gap-1 text-xs text-slate-400 font-bold uppercase tracking-wider">
                <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                <span>Rating</span>
              </div>
              <p className="mt-1 text-base font-bold text-[#172554]">
                {place.rating} / 5.0
              </p>
              <span className="text-[11px] text-slate-500">
                {place.reviewCount} traveler reviews
              </span>
            </div>

            <div className="rounded-2xl border border-[#E8D9C0] bg-white p-3.5 shadow-xs">
              <div className="flex items-center gap-1 text-xs text-slate-400 font-bold uppercase tracking-wider">
                <Clock className="w-3.5 h-3.5 text-[#0E7490]" />
                <span>Timing</span>
              </div>
              <p className="mt-1 text-xs font-bold text-[#172554] line-clamp-1">
                {place.timing.split('•')[0]}
              </p>
              <span className="text-[11px] text-emerald-600 font-semibold">
                Daily visitor schedule
              </span>
            </div>

            <div className="col-span-2 sm:col-span-1 rounded-2xl border border-[#E8D9C0] bg-white p-3.5 shadow-xs">
              <div className="flex items-center gap-1 text-xs text-slate-400 font-bold uppercase tracking-wider">
                <Ticket className="w-3.5 h-3.5 text-purple-600" />
                <span>Entry</span>
              </div>
              <p className="mt-1 text-xs font-bold text-[#172554] line-clamp-1">
                {place.entryFee || 'Free Admission'}
              </p>
              <span className="text-[11px] text-slate-500">Public Access</span>
            </div>
          </div>

          {/* Visitor Tip Card */}
          <VisitorTipCard tip={place.visitorTip} category={place.category} />

          {/* Detailed Overview */}
          <div className="rounded-3xl border border-[#E8D9C0] bg-white p-6 shadow-xs space-y-3">
            <h2 className="text-lg font-bold text-[#172554]">About {place.name}</h2>
            <p className="text-sm text-slate-700 leading-relaxed">
              {place.description}
            </p>
          </div>

          {/* Amenities & Facilities Checklist */}
          {place.amenities && place.amenities.length > 0 && (
            <div className="rounded-3xl border border-[#E8D9C0] bg-white p-6 shadow-xs space-y-3">
              <h3 className="text-sm font-bold uppercase tracking-wider text-[#172554]">
                Available Amenities & Facilities
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {place.amenities.map(item => (
                  <div
                    key={item}
                    className="flex items-center gap-2 rounded-xl bg-[#FAF6EF] p-2.5 text-xs font-medium text-[#172554] border border-[#E8D9C0]"
                  >
                    <CheckCircle2 className="w-4 h-4 text-[#0E7490] shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Source and Review Date Section */}
          <div className="rounded-2xl border border-[#E8D9C0] bg-[#FAF6EF] p-4 text-xs space-y-2 text-slate-600">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
              <span className="font-semibold text-[#172554]">Data Hygiene & Review Date:</span>
              <span className="text-slate-500">
                Curated record · Last reviewed{' '}
                {new Date(place.lastUpdated).toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </span>
            </div>

            {place.sourceName && (
              <div className="flex items-center justify-between pt-2 border-t border-[#E8D9C0]/70 text-[11px]">
                <span className="text-slate-500">Source:</span>
                {place.sourceUrl ? (
                  <a
                    href={place.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#0E7490] hover:underline inline-flex items-center gap-1 font-medium"
                  >
                    <span>{place.sourceName}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                ) : (
                  <span className="text-slate-700 font-medium">{place.sourceName}</span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Mini Map & Nearby Places */}
        <div className="space-y-6">
          {/* Location & Mini Map Box */}
          <div className="rounded-3xl border border-[#E8D9C0] bg-white p-5 shadow-xs space-y-3">
            <h3 className="text-sm font-bold text-[#172554]">Exact Location</h3>
            <p className="text-xs text-slate-600 flex items-start gap-1.5">
              <MapPin className="w-4 h-4 text-[#0E7490] shrink-0 mt-0.5" />
              <span>{place.address}</span>
            </p>

            <MiniMapPreview
              places={[place]}
              center={place.coordinates}
              zoom={15}
              height="h-56"
              showExploreLink={false}
            />
          </div>

          {/* Related Nearby Places */}
          <div className="rounded-3xl border border-[#E8D9C0] bg-white p-5 shadow-xs space-y-3">
            <h3 className="text-sm font-bold text-[#172554]">Nearby in Kashi</h3>
            <div className="space-y-3">
              {relatedPlaces.map(rel => (
                <Link
                  key={rel.id}
                  href={`/place/${rel.id}`}
                  className="group flex items-center gap-3 rounded-2xl border border-[#E8D9C0] p-2.5 hover:border-[#0E7490] hover:bg-[#FAF6EF] transition-all"
                >
                  <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-slate-100">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={rel.coverImage}
                      alt={rel.name}
                      className="h-full w-full object-cover"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#0E7490]">
                      {rel.category}
                    </span>
                    <h4 className="font-bold text-xs text-[#172554] truncate group-hover:text-[#0E7490]">
                      {rel.name}
                    </h4>
                    <span className="text-[11px] text-slate-500">★ {rel.rating}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
