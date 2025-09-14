# MongoDB Atlas Setup Guide

## Setting up MongoDB Atlas for GiftGenius

### 1. Create MongoDB Atlas Account
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up for a free account
3. Create a new project

### 2. Create a Cluster
1. Click "Build a Database"
2. Choose "Shared" (free tier)
3. Select your preferred cloud provider and region
4. Name your cluster (e.g., "giftgenius-cluster")
5. Click "Create Cluster"

### 3. Configure Database Access
1. Go to "Database Access" in the left sidebar
2. Click "Add New Database User"
3. Choose "Password" authentication
4. Create a username and secure password
5. Grant "Read and write to any database" privileges
6. Click "Add User"

### 4. Configure Network Access
1. Go to "Network Access" in the left sidebar
2. Click "Add IP Address"
3. For development: Click "Allow Access from Anywhere" (0.0.0.0/0)
4. For production: Add specific IP addresses
5. Click "Confirm"

### 5. Get Connection String
1. Go to "Databases" in the left sidebar
2. Click "Connect" on your cluster
3. Select "Connect your application"
4. Choose "Node.js" and version "4.1 or later"
5. Copy the connection string

### 6. Update Environment Configuration
1. Open the `.env` file in the backend directory
2. Replace the `MONGODB_URI` with your Atlas connection string:
   ```
   MONGODB_URI=mongodb+srv://<username>:<password>@<cluster-url>/giftgenius?retryWrites=true&w=majority
   ```
3. Replace `<username>`, `<password>`, and `<cluster-url>` with your actual values

### Example Connection String
```
MONGODB_URI=mongodb+srv://myuser:mypassword@giftgenius-cluster.abc123.mongodb.net/giftgenius?retryWrites=true&w=majority
```

### 7. Test the Connection
Run the following commands in the backend directory:

```bash
# Install dependencies (if not already done)
npm install

# Test connection by seeding the database
npm run seed

# Start the development server
npm run dev
```

### 8. Verify Database
1. Go back to MongoDB Atlas
2. Navigate to "Browse Collections"
3. You should see the "giftgenius" database with a "gifts" collection

## Security Best Practices
- Use strong passwords for database users
- Restrict IP access to known addresses in production
- Regularly rotate database passwords
- Monitor database usage in the Atlas dashboard

## Troubleshooting
- **Connection timeout**: Check network access settings and IP whitelist
- **Authentication failed**: Verify username and password in connection string
- **Database not found**: The database will be created automatically on first connection
- **SSL/TLS errors**: Ensure connection string includes `retryWrites=true&w=majority`