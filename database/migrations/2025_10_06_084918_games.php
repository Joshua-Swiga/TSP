<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('games', function(Blueprint $table){
            $table->id();
            $table->string('game_name_category');
            $table->string('name_of_the_game');
            $table->string('path_to_the_game_image');
            $table->boolean('status')->defalt(true);
            $table->integer('number_of_players_allowed')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        //
    }
};
