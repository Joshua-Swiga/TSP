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
        Schema::create('company_terms_and_conditions_before_using_play_or_pay', function (Blueprint $table) {
            $table->id();
            $table->boolean('user_has_agreed_to_company_terms_and_conditions_before_using_play_or_pay')->default(false);
            $table->foreignId('user_id')->nullable()->constrained('users')->onDelete('set null');
            $table->string('ip_address')->nullable();
            $table->string('exact_user_information')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('company_terms_and_conditions_before_using_play_or_pay', function (Blueprint $table) {
            //
        });
    }
};
