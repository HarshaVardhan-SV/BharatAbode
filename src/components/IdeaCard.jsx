import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';

const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1200&q=80';

export function IdeaCard({ idea, isSaved, onToggle }) {
  const images = useMemo(() => {
    if (Array.isArray(idea.images) && idea.images.length) return idea.images;
    if (idea.imageUrl) return [idea.imageUrl];
    return [FALLBACK_IMAGE];
  }, [idea.imageUrl, idea.images]);

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    setCurrentIndex(0);
  }, [idea.id]);

  const showCarouselControls = images.length > 1;

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -6, scale: 1.01 }}
      transition={{ type: 'spring', stiffness: 240, damping: 20 }}
      className="glass group overflow-hidden rounded-2xl transition-shadow duration-300 hover:shadow-2xl"
    >
      <div className="relative h-44 w-full">
        <img
          src={images[currentIndex]}
          alt={`${idea.title} view ${currentIndex + 1}`}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={(e) => {
            e.currentTarget.src = FALLBACK_IMAGE;
          }}
        />

        <span className="absolute right-3 top-3 rounded-full bg-black/50 px-3 py-1 text-xs text-white">
          {idea.category}
        </span>

        {showCarouselControls ? (
          <>
            <button
              type="button"
              onClick={() => setCurrentIndex((idx) => (idx === 0 ? images.length - 1 : idx - 1))}
              className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-black/50 px-2 py-1 text-xs text-white transition hover:bg-black/70"
              aria-label="Previous image"
            >
              Prev
            </button>
            <button
              type="button"
              onClick={() => setCurrentIndex((idx) => (idx + 1) % images.length)}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-black/50 px-2 py-1 text-xs text-white transition hover:bg-black/70"
              aria-label="Next image"
            >
              Next
            </button>

            <div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 gap-1">
              {images.map((_, idx) => (
                <button
                  key={`${idea.id}-dot-${idx}`}
                  type="button"
                  onClick={() => setCurrentIndex(idx)}
                  className={`h-1.5 w-4 rounded-full transition ${idx === currentIndex ? 'bg-white' : 'bg-white/40 hover:bg-white/70'}`}
                  aria-label={`Go to image ${idx + 1}`}
                />
              ))}
            </div>
          </>
        ) : null}
      </div>

      <div className="p-5">
        <h3 className="text-lg font-semibold">{idea.title}</h3>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{idea.description}</p>

        <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
          <div className="rounded-xl bg-white/40 p-3 dark:bg-slate-800/40">
            Rs. {idea.estimatedCost.toLocaleString('en-IN')}
          </div>
          <div className="rounded-xl bg-white/40 p-3 dark:bg-slate-800/40">{idea.valueIncrease}% ROI</div>
          <div className="col-span-2 rounded-xl bg-white/40 p-3 dark:bg-slate-800/40">{idea.timeRequired}</div>
        </div>

        <button
          onClick={() => onToggle(idea.id)}
          className={`mt-4 w-full rounded-xl px-4 py-2 text-sm font-medium ${
            isSaved
              ? 'bg-slate-800 text-white transition hover:bg-slate-700 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100'
              : 'bg-brand-600 text-white transition hover:bg-brand-500'
          }`}
        >
          {isSaved ? 'Remove Idea' : 'Save Idea'}
        </button>
      </div>
    </motion.article>
  );
}
