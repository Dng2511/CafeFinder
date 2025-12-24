// Test Cases for Edit Request API
// File: backend/test-edit-requests.js
// Run with: node test-edit-requests.js

const axios = require('axios');

const BASE_URL = 'http://localhost:3000';

// Sample JWT token (you would get this from login endpoint)
const TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'; // Replace with actual token

// Test 1: Create edit request with basic fields
async function testCreateBasicEditRequest() {
  try {
    console.log('\n=== Test 1: Create Basic Edit Request ===');
    const response = await axios.post(
      `${BASE_URL}/cafes/1/edit-requests`,
      {
        name: 'Updated Coffee Haven',
        phone_number: '0987654321'
      },
      {
        headers: {
          'Authorization': `Bearer ${TOKEN}`,
          'Content-Type': 'application/json'
        }
      }
    );
    console.log('Success:', response.data);
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
  }
}

// Test 2: Create edit request with menu items
async function testCreateEditRequestWithMenu() {
  try {
    console.log('\n=== Test 2: Create Edit Request with Menu Items ===');
    const response = await axios.post(
      `${BASE_URL}/cafes/1/edit-requests`,
      {
        name: 'Coffee Haven Premium',
        menu_items: [
          {
            item_name: 'Premium Espresso',
            price: 45000,
            image: 'https://example.com/espresso.jpg'
          },
          {
            item_name: 'Specialty Latte',
            price: 55000,
            image: 'https://example.com/latte.jpg'
          }
        ]
      },
      {
        headers: {
          'Authorization': `Bearer ${TOKEN}`,
          'Content-Type': 'application/json'
        }
      }
    );
    console.log('Success:', response.data);
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
  }
}

// Test 3: Create edit request with all amenities
async function testCreateEditRequestWithAmenities() {
  try {
    console.log('\n=== Test 3: Create Edit Request with Amenities ===');
    const response = await axios.post(
      `${BASE_URL}/cafes/2/edit-requests`,
      {
        address: '45 River Road, District 3, HCM',
        open_time: '07:30',
        close_time: '23:30',
        has_wifi: true,
        has_parking: true,
        has_air_conditioning: true,
        has_power_outlet: true,
        is_quiet: true,
        no_smoking: true
      },
      {
        headers: {
          'Authorization': `Bearer ${TOKEN}`,
          'Content-Type': 'application/json'
        }
      }
    );
    console.log('Success:', response.data);
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
  }
}

// Test 4: Create edit request with cafe images
async function testCreateEditRequestWithImages() {
  try {
    console.log('\n=== Test 4: Create Edit Request with Cafe Images ===');
    const response = await axios.post(
      `${BASE_URL}/cafes/3/edit-requests`,
      {
        name: 'Urban Brews Updated',
        cafe_images: [
          'https://example.com/cafe-1.jpg',
          'https://example.com/cafe-2.jpg',
          'https://example.com/cafe-3.jpg'
        ]
      },
      {
        headers: {
          'Authorization': `Bearer ${TOKEN}`,
          'Content-Type': 'application/json'
        }
      }
    );
    console.log('Success:', response.data);
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
  }
}

// Test 5: Invalid request - no fields
async function testNoFields() {
  try {
    console.log('\n=== Test 5: Invalid - No Fields ===');
    const response = await axios.post(
      `${BASE_URL}/cafes/1/edit-requests`,
      {},
      {
        headers: {
          'Authorization': `Bearer ${TOKEN}`,
          'Content-Type': 'application/json'
        }
      }
    );
    console.log('Success:', response.data);
  } catch (error) {
    console.error('Expected Error:', error.response?.data || error.message);
  }
}

// Test 6: Invalid request - bad time format
async function testInvalidTimeFormat() {
  try {
    console.log('\n=== Test 6: Invalid - Bad Time Format ===');
    const response = await axios.post(
      `${BASE_URL}/cafes/1/edit-requests`,
      {
        open_time: '7:00' // Should be 07:00
      },
      {
        headers: {
          'Authorization': `Bearer ${TOKEN}`,
          'Content-Type': 'application/json'
        }
      }
    );
    console.log('Success:', response.data);
  } catch (error) {
    console.error('Expected Error:', error.response?.data || error.message);
  }
}

// Test 7: Invalid request - bad menu item
async function testInvalidMenuItem() {
  try {
    console.log('\n=== Test 7: Invalid - Missing Menu Price ===');
    const response = await axios.post(
      `${BASE_URL}/cafes/1/edit-requests`,
      {
        menu_items: [
          {
            item_name: 'Espresso'
            // Missing price
          }
        ]
      },
      {
        headers: {
          'Authorization': `Bearer ${TOKEN}`,
          'Content-Type': 'application/json'
        }
      }
    );
    console.log('Success:', response.data);
  } catch (error) {
    console.error('Expected Error:', error.response?.data || error.message);
  }
}

// Test 8: Missing authentication
async function testMissingAuth() {
  try {
    console.log('\n=== Test 8: Missing Authentication ===');
    const response = await axios.post(
      `${BASE_URL}/cafes/1/edit-requests`,
      {
        name: 'Test Cafe'
      },
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
    console.log('Success:', response.data);
  } catch (error) {
    console.error('Expected Error:', error.response?.data || error.message);
  }
}

// Test 9: Invalid cafe ID
async function testInvalidCafeId() {
  try {
    console.log('\n=== Test 9: Invalid Cafe ID ===');
    const response = await axios.post(
      `${BASE_URL}/cafes/999/edit-requests`,
      {
        name: 'Test Cafe'
      },
      {
        headers: {
          'Authorization': `Bearer ${TOKEN}`,
          'Content-Type': 'application/json'
        }
      }
    );
    console.log('Success:', response.data);
  } catch (error) {
    console.error('Expected Error:', error.response?.data || error.message);
  }
}

// Run all tests
async function runAllTests() {
  console.log('Starting Edit Request API Tests...');

  // Comment out tests you don't want to run
  await testCreateBasicEditRequest();
  await testCreateEditRequestWithMenu();
  await testCreateEditRequestWithAmenities();
  await testCreateEditRequestWithImages();
  await testNoFields();
  await testInvalidTimeFormat();
  await testInvalidMenuItem();
  await testMissingAuth();
  await testInvalidCafeId();

  console.log('\n=== All Tests Completed ===');
}

// Alternative: Using FormData for file upload
async function testCreateEditRequestWithFileUpload() {
  try {
    console.log('\n=== Test: Create Edit Request with File Upload ===');
    const FormData = require('form-data');
    const fs = require('fs');

    const formData = new FormData();
    formData.append('name', 'Coffee Haven with Image');
    formData.append('phone_number', '0987654321');
    formData.append('menu_items', JSON.stringify([
      { item_name: 'Espresso', price: 40000 }
    ]));
    formData.append('main_image', fs.createReadStream('/path/to/image.jpg'));

    const response = await axios.post(
      `${BASE_URL}/cafes/1/edit-requests`,
      formData,
      {
        headers: {
          'Authorization': `Bearer ${TOKEN}`,
          ...formData.getHeaders()
        }
      }
    );
    console.log('Success:', response.data);
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
  }
}

// Export for use in other test files
module.exports = {
  testCreateBasicEditRequest,
  testCreateEditRequestWithMenu,
  testCreateEditRequestWithAmenities,
  testCreateEditRequestWithImages,
  testInvalidMenuItem,
  testMissingAuth,
  runAllTests
};

// Run tests if this file is executed directly
if (require.main === module) {
  runAllTests();
}

