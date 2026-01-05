#!/bin/bash

echo "🧪 Testing Twitter API Backend"
echo "==============================="
echo ""

# Test 1: Health Check
echo "1️⃣ Health Check:"
HEALTH=$(curl -s http://localhost:3001/api/health)
echo $HEALTH | python3 -m json.tool 2>/dev/null || echo $HEALTH
echo ""

# Test 2: Fetch @flxthesixth
echo "2️⃣ Fetch @flxthesixth:"
PROFILE=$(curl -s "http://localhost:3001/api/twitter/profile?username=flxthesixth")
echo $PROFILE | python3 -m json.tool 2>/dev/null || echo $PROFILE
echo ""

# Test 3: Fetch @github (popular account)
echo "3️⃣ Fetch @github:"
GITHUB=$(curl -s "http://localhost:3001/api/twitter/profile?username=github")
echo $GITHUB | python3 -m json.tool 2>/dev/null || echo $GITHUB
echo ""

echo "✅ All tests completed!"
