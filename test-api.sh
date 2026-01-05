#!/bin/bash

echo "🧪 Testing Twitter API Backend"
echo "================================"
echo ""

echo "1️⃣ Health Check:"
curl -s http://localhost:3001/api/health | python3 -m json.tool
echo ""
echo ""

echo "2️⃣ Testing @flxthesixth:"
curl -s "http://localhost:3001/api/twitter/profile?username=flxthesixth" | python3 -m json.tool
echo ""
echo ""

echo "3️⃣ Testing @github:"
curl -s "http://localhost:3001/api/twitter/profile?username=github" | python3 -m json.tool
