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
        Schema::create('activity_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            $table->string('action');                 // e.g. provider.approved
            $table->string('description');
            $table->nullableMorphs('subject');        // what it happened to (subject_type, subject_id)
            $table->json('properties')->nullable();   // extra details, e.g. reason, amount
            $table->string('ip_address', 45)->nullable();
            $table->timestamp('created_at');

            $table->index('action');
            $table->index('created_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('activity_logs');
    }
};
