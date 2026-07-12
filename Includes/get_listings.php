<?php
/**
 * get_listings.php — Returns all apartment listings from the database as JSON.
 */

header('Content-Type: application/json; charset=utf-8');

require_once 'db_connect.php';

$sql = "SELECT listing_id, posted_by_username AS posted_by, city, address,
               contact_phone, total_rent, room_count, available_from, description,
               roommate_gender_pref, pet_friendly, created_at
        FROM apartment_listings
        ORDER BY created_at DESC";

$result = $conn->query($sql);

if (!$result) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'שגיאה בשליפת הנתונים']);
    $conn->close();
    exit;
}

$listings = [];
while ($row = $result->fetch_assoc()) {
    $row['total_rent']   = floatval($row['total_rent']);
    $row['room_count']   = intval($row['room_count']);
    $row['pet_friendly'] = intval($row['pet_friendly']);
    $row['listing_id']   = intval($row['listing_id']);
    $listings[] = $row;
}

echo json_encode(['success' => true, 'listings' => $listings]);

$conn->close();
