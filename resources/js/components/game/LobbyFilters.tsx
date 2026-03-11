import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { useForm } from '@inertiajs/react';

export default function LobbyFilters({
    query,
    setQuery,
    status,
    setStatus,
    initialFilters = {},
}: {
    query: string;
    setQuery: (v: string) => void;
    status: 'all' | 'open' | 'in_progress' | 'finished';
    setStatus: (s: any) => void;
    initialFilters?: any;
}) {
    const { data, get, setData } = useForm({
        name_of_the_game: initialFilters.name_of_the_game ?? '',
        game_name_category: initialFilters.game_name_category ?? '',
        status_filter: initialFilters.status_filter ?? '',
        include_all: initialFilters.include_all ?? false,
    });

    function submitSearch() {
        // Update parent local state for immediate UX
        setQuery(data.name_of_the_game);
        setStatus(data.status_filter === 'still_on' ? 'open' : data.status_filter === 'ended' ? 'finished' : 'all');

        // Make a GET request to the current lobby URL with query params.
        // Use window.location.pathname so we avoid relying on a Ziggy `route` helper being present.
        get(window.location.pathname, { preserveState: true, replace: true });
    }

    return (
        <div >
        </div>
    );
}
