import React from 'react';
import { MapPin, Building, Link as LinkIcon, Twitter, Users, ExternalLink, Calendar, CheckCircle2, ShieldCheck, Flame } from 'lucide-react';
import Badge from '../common/Badge';
import { useAuth } from '../../context/AuthContext';

export default function ProfileCard({ profile, isLive = false, onConnectClick }) {
  const { isAuthenticated, monitoredUsername } = useAuth();

  return (
    <div className="rounded-2xl border border-gh-lightBorder dark:border-gh-darkBorder bg-white dark:bg-gh-darkPanel p-6 shadow-sm">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
        {/* Avatar with status ring */}
        <div className="relative">
          <img
            src={profile.avatarUrl}
            alt={profile.name}
            className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-2 border-emerald-500/80 shadow-md object-cover bg-gh-lightBorder dark:bg-gh-darkCard"
          />
          <div
            className="absolute bottom-0 right-0 p-1.5 rounded-full bg-emerald-500 text-white shadow"
            title="Active streak contributor"
          >
            <Flame className="w-3.5 h-3.5 fill-white" />
          </div>
        </div>

        {/* Details */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <h1 className="text-xl sm:text-2xl font-bold text-gh-lightText dark:text-gh-darkText truncate">
              {profile.name}
            </h1>
            <a
              href={`https://github.com/${profile.username}`}
              target="_blank"
              rel="noreferrer"
              className="text-xs font-mono text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
            >
              @{profile.username}
              <ExternalLink className="w-3 h-3" />
            </a>
            <Badge variant={isLive ? 'emerald' : 'default'} size="xs">
              {isLive ? 'Live GitHub Profile' : 'Realistic Demo Data'}
            </Badge>
          </div>

          <p className="text-xs sm:text-sm text-gh-lightMuted dark:text-gh-darkMuted leading-relaxed max-w-2xl mb-3">
            {profile.bio}
          </p>

          {/* Metadata badges */}
          <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-xs text-gh-lightMuted dark:text-gh-darkMuted">
            {profile.location && (
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-gh-lightMuted dark:text-gh-darkMuted" />
                {profile.location}
              </span>
            )}
            {profile.company && (
              <span className="flex items-center gap-1">
                <Building className="w-3.5 h-3.5 text-gh-lightMuted dark:text-gh-darkMuted" />
                {profile.company}
              </span>
            )}
            {profile.blog && (
              <a
                href={profile.blog}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1 hover:text-emerald-500 transition-colors"
              >
                <LinkIcon className="w-3.5 h-3.5" />
                {profile.blog.replace(/^https?:\/\//, '')}
              </a>
            )}
            <span className="flex items-center gap-1">
              <Users className="w-3.5 h-3.5" />
              <strong className="text-gh-lightText dark:text-gh-darkText">{profile.followers}</strong> followers
              <span className="mx-0.5">·</span>
              <strong className="text-gh-lightText dark:text-gh-darkText">{profile.following}</strong> following
            </span>
          </div>
        </div>

        {/* Quick action: Connect or Switch */}
        <div className="w-full sm:w-auto flex sm:flex-col gap-2 shrink-0 pt-2 sm:pt-0">
          <a
            href={`https://github.com/${profile.username}`}
            target="_blank"
            rel="noreferrer"
            className="flex-1 sm:flex-none px-3.5 py-2 text-xs font-medium rounded-xl border border-gh-lightBorder dark:border-gh-darkBorder text-gh-lightText dark:text-gh-darkText hover:bg-gray-50 dark:hover:bg-gh-darkCard transition-colors flex items-center justify-center gap-1.5"
          >
            GitHub Profile <ExternalLink className="w-3 h-3" />
          </a>
          <button
            onClick={onConnectClick}
            className="flex-1 sm:flex-none px-3.5 py-2 text-xs font-medium rounded-xl bg-gh-lightBg dark:bg-gh-darkCard border border-gh-lightBorder dark:border-gh-darkBorder hover:border-emerald-500 text-gh-lightText dark:text-gh-darkText transition-all flex items-center justify-center gap-1.5"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span>{isAuthenticated ? 'Owner Settings' : 'Switch / Connect'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
