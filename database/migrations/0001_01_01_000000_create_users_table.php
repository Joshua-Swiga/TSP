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
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('email')->unique();
            $table->timestamp('email_verified_at')->nullable();
            $table->string('password');
            $table->rememberToken();
            $table->timestamps();

            $table->string('phone_number')->nullable();
            // System Generated
            $table->string('tokens')->default('300')->nullable();
            $table->string('tokens_earned')->default('0')->nullable();
            $table->string('tokens_lost')->default(0)->nullable();
            $table->string('last_login')->nullable();
            $table->string('profile_picture')->nullable(); // Provide a default one for when a user is created
            $table->boolean('allows_notifications')->default(false); // Can only be turned on when a user has provided a phone number 
            $table->integer('total_games_plaid')->default(0);
            $table->integer('total_games_lost')->default(0);
            $table->integer('total_games_won')->default(0);
            
        });

        Schema::create('password_reset_tokens', function (Blueprint $table) {
            $table->string('email')->primary();
            $table->string('token');
            $table->timestamp('created_at')->nullable();
        });

        Schema::create('sessions', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->foreignId('user_id')->nullable()->index();
            $table->string('ip_address', 45)->nullable();
            $table->text('user_agent')->nullable();
            $table->longText('payload');
            $table->integer('last_activity')->index();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('users');
        Schema::dropIfExists('password_reset_tokens');
        Schema::dropIfExists('sessions');
    }
};
