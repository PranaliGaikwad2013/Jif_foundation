<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Volunteer extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'country_code',
        'mobile',
        'profile_image',
        'status',
    ];

    /**
     * Get the profile image URL.
     *
     * @return string|null
     */
    public function getProfileImageUrlAttribute(): ?string
    {
        if ($this->profile_image) {
            return asset('upload/' . $this->profile_image);
        }
        return null;
    }
}
