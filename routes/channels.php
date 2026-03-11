<?php

use Illuminate\Support\Facades\Broadcast;
use App\Models\channelModel;

Broadcast::channel('App.Models.User.{id}', function ($user, $id) {
    return (int) $user->id === (int) $id;
});

Broadcast::channel('channel.{channelId}', function ($user, $channelId) {
    // allow only users who belong to the channel
    return \App\Models\channelUsers::where('channel_id', $channelId)
        ->where('user_id', $user->id)
        ->exists();
});
