<?php
/**
 * save_listing.php — Saves a new apartment listing to the database.
 * This is the PHP form handler required by the client-side web course.
 * Receives POST data from the new-listing form and inserts into apartment_listings.
 */

header('Content-Type: application/json; charset=utf-8');

// Only accept POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit;
}

require_once 'db_connect.php';

// Read and sanitize input
$city                 = trim($_POST['city'] ?? '');
$address              = trim($_POST['address'] ?? '');
$total_rent           = floatval($_POST['total_rent'] ?? 0);
$room_count           = intval($_POST['room_count'] ?? 0);
$available_from       = trim($_POST['available_from'] ?? '');
$description          = trim($_POST['description'] ?? '');
$roommate_gender_pref = trim($_POST['roommate_gender_pref'] ?? 'any');
$pet_friendly         = isset($_POST['pet_friendly']) ? 1 : 0;
$contact_phone        = preg_replace('/[^\d]/', '', $_POST['contact_phone'] ?? '');
$posted_by_username   = trim($_POST['posted_by_username'] ?? 'anonymous');

// Server-side validation
$errors = [];

if ($contact_phone === '' || strlen($contact_phone) < 9 || strlen($contact_phone) > 10) {
    $errors[] = 'טלפון חייב להכיל 9-10 ספרות';
} elseif ($contact_phone[0] !== '0') {
    $errors[] = 'טלפון חייב להתחיל ב-0';
}
if (strlen($city) < 2) {
    $errors[] = 'עיר חייבת להכיל לפחות 2 תווים';
}
if (strlen($address) < 5) {
    $errors[] = 'כתובת חייבת להכיל לפחות 5 תווים';
}
if ($total_rent <= 0 || $total_rent > 20000) {
    $errors[] = 'שכר דירה חייב להיות בין 1 ל-20,000';
}
if ($room_count < 1 || $room_count > 10) {
    $errors[] = 'מספר חדרים חייב להיות בין 1 ל-10';
}
if (empty($available_from)) {
    $errors[] = 'תאריך כניסה הוא שדה חובה';
} else {
    $today = date('Y-m-d');
    if ($available_from < $today) {
        $errors[] = 'תאריך כניסה חייב להיות בעתיד';
    }
}
if (strlen($description) < 10) {
    $errors[] = 'תיאור חייב להכיל לפחות 10 תווים';
}

if (!empty($errors)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => implode(', ', $errors)]);
    $conn->close();
    exit;
}

// Prepare and execute the insert
$stmt = $conn->prepare(
    "INSERT INTO apartment_listings
     (posted_by_username, city, address, contact_phone, total_rent, room_count, available_from, description, roommate_gender_pref, pet_friendly)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
);

$stmt->bind_param(
    'ssssdisssi',
    $posted_by_username,
    $city,
    $address,
    $contact_phone,
    $total_rent,
    $room_count,
    $available_from,
    $description,
    $roommate_gender_pref,
    $pet_friendly
);

if ($stmt->execute()) {
    $listing_id = $stmt->insert_id;
    echo json_encode([
        'success'    => true,
        'message'    => 'הדירה פורסמה בהצלחה!',
        'listing_id' => $listing_id
    ]);
} else {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'שגיאה בשמירת הנתונים: ' . $stmt->error]);
}

$stmt->close();
$conn->close();
