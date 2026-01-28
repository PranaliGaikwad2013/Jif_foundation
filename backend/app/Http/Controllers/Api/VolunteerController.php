<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Volunteer;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class VolunteerController extends Controller
{
    /**
     * Display a listing of volunteers.
     */
    public function index()
    {
        $volunteers = Volunteer::orderBy('created_at', 'desc')->get();

        return response()->json([
            'success' => true,
            'data' => $volunteers
        ]);
    }

    /**
     * Get volunteer statistics for dashboard.
     */
    public function stats()
    {
        $totalVolunteers = Volunteer::count();
        $activeVolunteers = Volunteer::where('status', 'active')->count();
        $inactiveVolunteers = Volunteer::where('status', 'inactive')->count();

        return response()->json([
            'success' => true,
            'data' => [
                'total' => $totalVolunteers,
                'active' => $activeVolunteers,
                'inactive' => $inactiveVolunteers,
            ]
        ]);
    }

    /**
     * Store a newly created volunteer.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:volunteers',
            'country_code' => 'required|string|max:10',
            'mobile' => 'required|string|max:20',
            'profile_image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'status' => 'required|in:active,inactive',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation errors',
                'errors' => $validator->errors()
            ], 422);
        }

        $data = $request->except('profile_image');

        // Handle profile image upload
        if ($request->hasFile('profile_image')) {
            $image = $request->file('profile_image');
            $imageName = Str::uuid() . '.' . $image->getClientOriginalExtension();

            // Ensure upload directory exists
            $uploadPath = public_path('upload');
            if (!file_exists($uploadPath)) {
                mkdir($uploadPath, 0755, true);
            }

            $image->move($uploadPath, $imageName);
            $data['profile_image'] = $imageName;
        }

        $volunteer = Volunteer::create($data);

        return response()->json([
            'success' => true,
            'message' => 'Volunteer created successfully',
            'data' => $volunteer
        ], 201);
    }

    /**
     * Display the specified volunteer.
     */
    public function show(string $id)
    {
        $volunteer = Volunteer::find($id);

        if (!$volunteer) {
            return response()->json([
                'success' => false,
                'message' => 'Volunteer not found'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $volunteer
        ]);
    }

    /**
     * Update the specified volunteer.
     */
    public function update(Request $request, string $id)
    {
        $volunteer = Volunteer::find($id);

        if (!$volunteer) {
            return response()->json([
                'success' => false,
                'message' => 'Volunteer not found'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|required|string|max:255',
            'email' => 'sometimes|required|string|email|max:255|unique:volunteers,email,' . $id,
            'country_code' => 'sometimes|required|string|max:10',
            'mobile' => 'sometimes|required|string|max:20',
            'profile_image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'status' => 'sometimes|required|in:active,inactive',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation errors',
                'errors' => $validator->errors()
            ], 422);
        }

        $data = $request->except('profile_image');

        // Handle profile image upload
        if ($request->hasFile('profile_image')) {
            // Delete old image if exists
            if ($volunteer->profile_image) {
                $oldImagePath = public_path('upload/' . $volunteer->profile_image);
                if (file_exists($oldImagePath)) {
                    unlink($oldImagePath);
                }
            }

            $image = $request->file('profile_image');
            $imageName = Str::uuid() . '.' . $image->getClientOriginalExtension();

            // Ensure upload directory exists
            $uploadPath = public_path('upload');
            if (!file_exists($uploadPath)) {
                mkdir($uploadPath, 0755, true);
            }

            $image->move($uploadPath, $imageName);
            $data['profile_image'] = $imageName;
        }

        $volunteer->update($data);

        return response()->json([
            'success' => true,
            'message' => 'Volunteer updated successfully',
            'data' => $volunteer
        ]);
    }

    /**
     * Remove the specified volunteer.
     */
    public function destroy(string $id)
    {
        $volunteer = Volunteer::find($id);

        if (!$volunteer) {
            return response()->json([
                'success' => false,
                'message' => 'Volunteer not found'
            ], 404);
        }

        // Delete profile image if exists
        if ($volunteer->profile_image) {
            $imagePath = public_path('upload/' . $volunteer->profile_image);
            if (file_exists($imagePath)) {
                unlink($imagePath);
            }
        }

        $volunteer->delete();

        return response()->json([
            'success' => true,
            'message' => 'Volunteer deleted successfully'
        ]);
    }

    /**
     * Export volunteers data.
     */
    public function export()
    {
        $volunteers = Volunteer::all();

        $csvData = "ID,Name,Email,Country Code,Mobile,Status,Created At\n";

        foreach ($volunteers as $volunteer) {
            $csvData .= "{$volunteer->id},{$volunteer->name},{$volunteer->email},{$volunteer->country_code},{$volunteer->mobile},{$volunteer->status},{$volunteer->created_at}\n";
        }

        return response($csvData)
            ->header('Content-Type', 'text/csv')
            ->header('Content-Disposition', 'attachment; filename="volunteers.csv"');
    }
}
