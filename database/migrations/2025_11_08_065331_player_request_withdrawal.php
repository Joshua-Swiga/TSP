<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    
    /**
     * Create the player_request_withdrawal table.
     *
     * @return void
    */
    public function up(): void
    {
        Schema::create('player_request_withdrawal', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->string('ip_address')->nullable();
            $table->string('user_agent')->nullable(); 
            $table->decimal('amount', 10, 2)->nullable(); 
            $table->decimal('fee', 8, 2)->default(0); 
            $table->string('method', 50)->default('mpesa'); 
            $table->string('phone_number')->nullable(); 
            $table->string('transaction_reference')->nullable(); 
            $table->enum('status', ['pending', 'approved', 'rejected', 'processing', 'completed', 'cancelled'])->default('pending');
            $table->foreignId('processed_by')->nullable()->constrained('users')->onDelete('set null'); 
            $table->timestamp('processed_at')->nullable();
            $table->text('rejection_reason')->nullable();
            $table->boolean('is_active')->default(true); 
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
