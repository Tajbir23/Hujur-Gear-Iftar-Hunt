const mongoose = require('mongoose');

const MONGODB_URI = 'mongodb+srv://akash123:akash123@cluster0.sdyx3bs.mongodb.net/hujur-gear-iftar-hunt?appName=Cluster0';

const areas = ["Mirpur", "Uttara", "Gulshan", "Banani", "Dhanmondi", "Mohammadpur", "Badda", "Malibagh", "Motijheel", "Farmgate", "Khilgaon", "Rampura", "Mogbazar", "Tongi", "Cantonment", "Bashundhara", "Mohakhali", "Tejgaon", "Jatrabari", "Puran Dhaka", "Lalbagh", "Azimpur", "Hazaribagh", "Kamrangirchar", "Basabo", "Mugdha", "Shantinagar", "Kakrail", "Eskaton", "Shahbagh", "Nilkhet", "Elephant Road", "Green Road", "Panthapath", "Agargaon", "Shyamoli", "Kalyanpur", "Darussalam", "Pallabi", "Kafrul", "Bhasantek", "Kuril", "Baridhara", "Niketan", "Banashree", "Aftabnagar", "Merul Badda", "Shahjahanpur", "Gendaria", "Sutrapur"];
const types = ["Jame Masjid", "Central Mosque", "Baitul Aman Mosque", "Baitus Salam Jame Masjid", "Society Mosque", "Sector Mosque", "Gausia Mosque", "Noor Jame Masjid", "Baitun Noor Mosque", "Madani Jame Masjid", "Taqwa Masjid", "Baitul Falah Mosque", "Baitul Mamur", "Baitush Sharaf", "Baitul Atiq", "Baitul Mukarram (Local)", "An-Noor Mosque"];

const facilitiesList = ["AC Available", "Good Fan Coverage", "Suffocating", "Parking", "Wudu Area", "Women Section"];

function getRandomItem(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

function getRandomFacilities() {
    const num = Math.floor(Math.random() * 4) + 1; // 1 to 4 facilities
    const shuffled = [...facilitiesList].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, num);
}

function generateRandomCoordinates() {
    // Dhaka bounds roughly
    const lat = 23.7000 + Math.random() * (23.8800 - 23.7000);
    const lng = 90.3500 + Math.random() * (90.4500 - 90.3500);
    return [lng, lat]; // MongoDB expects [longitude, latitude]
}

function generateDummyMosques(count) {
    const mosques = [];
    for (let i = 0; i < count; i++) {
        const area = getRandomItem(areas);
        const type = getRandomItem(types);
        const name = `${area} ${type}`;

        mosques.push({
            name: name,
            location: {
                type: "Point",
                coordinates: generateRandomCoordinates()
            },
            address: `${area}, Dhaka, Bangladesh`,
            facilities: getRandomFacilities(),
            addedBy: `dummy-user-${Math.floor(Math.random() * 10000)}`,
            addedByIp: `192.168.1.${Math.floor(Math.random() * 255)}`,
            verified: Math.random() > 0.5, // 50% chance of being verified
            createdAt: new Date(),
            updatedAt: new Date()
        });
    }
    return mosques;
}

async function seed() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB');

        const MosqueSchema = new mongoose.Schema(
            {
                name: { type: String },
                location: {
                    type: { type: String, enum: ["Point"], default: "Point" },
                    coordinates: { type: [Number] },
                },
                address: { type: String },
                facilities: { type: [String] },
                addedBy: { type: String },
                addedByIp: { type: String },
                verified: { type: Boolean },
            },
            { timestamps: true }
        );

        // create 2dsphere index for location
        MosqueSchema.index({ location: "2dsphere" });

        const Mosque = mongoose.models.Mosque || mongoose.model("Mosque", MosqueSchema);

        const dummyData = generateDummyMosques(150); // Generate 150 addresses

        await Mosque.insertMany(dummyData);
        console.log(`Successfully seeded ${dummyData.length} Mosques.`);

        process.exit(0);
    } catch (error) {
        console.error('Error seeding data:', error);
        process.exit(1);
    }
}

seed();
