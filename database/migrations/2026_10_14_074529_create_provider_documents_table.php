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
        Schema::create('provider_documents', function (Blueprint $table) {
            $table->id();
            $table->foreignId('provider_profile_id')->constrained()->cascadeOnDelete();
            $table->string('type'); // identity | ssm | certificate
            $table->string('file_path');
            $table->string('original_name');
            $table->timestamps();

            $table->unique(['provider_profile_id', 'type']);
        });

        Schema::table('provider_profiles', function (Blueprint $table) {
            $table->text('rejection_reason')->nullable();
        });
    }

    public function down(): void
    {
        Schema::table('provider_profiles', function (Blueprint $table) {
            $table->dropColumn('rejection_reason');
        });

        Schema::dropIfExists('provider_documents');
    }
};
