<?php

namespace Tests\Feature;

use App\Models\GalleryPhoto;
use App\Models\ProviderProfile;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class GalleryTest extends TestCase
{
    use RefreshDatabase;

    private function approvedProvider(): ProviderProfile
    {
        $profile = ProviderProfile::factory()->create(['status' => 'approved']);
        $profile->user->update(['role' => 'provider']);

        return $profile;
    }

    public function test_provider_can_upload_photos(): void
    {
        Storage::fake('public');
        $profile = $this->approvedProvider();

        $response = $this->actingAs($profile->user)->post(route('provider.gallery.store'), [
            'photos' => [
                UploadedFile::fake()->image('one.jpg'),
                UploadedFile::fake()->image('two.png'),
            ],
        ]);

        $response->assertSessionHasNoErrors();
        $this->assertDatabaseCount('gallery_photos', 2);

        GalleryPhoto::all()->each(
            fn ($photo) => Storage::disk('public')->assertExists($photo->path)
        );
    }

    public function test_provider_cannot_exceed_photo_limit(): void
    {
        Storage::fake('public');
        $profile = $this->approvedProvider();

        for ($i = 0; $i < GalleryPhoto::MAX_PER_PROVIDER; $i++) {
            $profile->galleryPhotos()->create(['path' => "provider-gallery/{$i}.jpg"]);
        }

        $response = $this->actingAs($profile->user)->post(route('provider.gallery.store'), [
            'photos' => [UploadedFile::fake()->image('extra.jpg')],
        ]);

        $response->assertSessionHasErrors('photos');
        $this->assertDatabaseCount('gallery_photos', GalleryPhoto::MAX_PER_PROVIDER);
    }

    public function test_non_image_files_are_rejected(): void
    {
        Storage::fake('public');
        $profile = $this->approvedProvider();

        $response = $this->actingAs($profile->user)->post(route('provider.gallery.store'), [
            'photos' => [UploadedFile::fake()->create('doc.pdf', 100, 'application/pdf')],
        ]);

        $response->assertSessionHasErrors('photos.0');
        $this->assertDatabaseCount('gallery_photos', 0);
    }

    public function test_provider_can_delete_own_photo_and_file_is_removed(): void
    {
        Storage::fake('public');
        $profile = $this->approvedProvider();

        Storage::disk('public')->put('provider-gallery/mine.jpg', 'data');
        $photo = $profile->galleryPhotos()->create(['path' => 'provider-gallery/mine.jpg']);

        $this->actingAs($profile->user)
            ->delete(route('provider.gallery.destroy', $photo))
            ->assertSessionHasNoErrors();

        $this->assertDatabaseMissing('gallery_photos', ['id' => $photo->id]);
        Storage::disk('public')->assertMissing('provider-gallery/mine.jpg');
    }

    public function test_provider_cannot_delete_another_providers_photo(): void
    {
        Storage::fake('public');
        $owner = $this->approvedProvider();
        $intruder = $this->approvedProvider();

        Storage::disk('public')->put('provider-gallery/theirs.jpg', 'data');
        $photo = $owner->galleryPhotos()->create(['path' => 'provider-gallery/theirs.jpg']);

        $this->actingAs($intruder->user)
            ->delete(route('provider.gallery.destroy', $photo))
            ->assertForbidden();

        $this->assertDatabaseHas('gallery_photos', ['id' => $photo->id]);
        Storage::disk('public')->assertExists('provider-gallery/theirs.jpg');
    }

    public function test_customer_cannot_open_the_gallery_manager(): void
    {
        $customer = User::factory()->create(['role' => 'customer']);

        $this->actingAs($customer)
            ->get(route('provider.gallery.index'))
            ->assertForbidden();
    }

    public function test_public_profile_includes_gallery_photos(): void
    {
        $profile = $this->approvedProvider();
        $profile->galleryPhotos()->create(['path' => 'provider-gallery/a.jpg']);
        $profile->galleryPhotos()->create(['path' => 'provider-gallery/b.jpg']);

        $this->get(route('providers.show', $profile))
            ->assertInertia(fn (Assert $page) => $page
                ->component('Providers/Show')
                ->has('provider.gallery_photos', 2)
            );
    }
}