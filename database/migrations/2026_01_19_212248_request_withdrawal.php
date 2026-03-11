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
     Schema::create('request_withdrawals', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')
                ->constrained()
                ->cascadeOnDelete();
            $table->foreignId('user_that_processed_the_request')
                ->nullable()
                ->constrained('users');
            $table->string('status' )->default('pending');
            $table->string('method')->nullable();
            $table->decimal('amount', 10, 2);
            $table->string('currency', 3);
            $table->string('uuid')->unique();
            $table->text('comments')->nullable();
            $table->string('fee');
            $table->string('transaction_code')->nullable();
            $table->boolean('flagged')->default(false);
            $table->timestamps();
        });

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('request_withdrawals');
    }

};
