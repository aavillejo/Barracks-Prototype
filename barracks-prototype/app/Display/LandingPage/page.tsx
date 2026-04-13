import Card from "../Card";
import Header from "../Header";

interface CardData {
    title: string;
    totalLabel: string;
    total: string;
    recentLabel: string;
    recent: string;
    updated: string;
    href: string;
}

interface LandingPageProps {
    recordsData?: CardData;
    staffData?: CardData; // Renamed for clarity
    inventoryData?: CardData; // This is the new third card
}

export default function LandingPage({
    recordsData = {
        title: "Customer Records",
        totalLabel: "Total Records",
        total: "1,247",
        recentLabel: "Recent:",
        recent: "#6767 - Customer Real",
        updated: "Updated: Today, 2:15 PM",
        href: "/Records/CustomerRecords"
    }, 
    staffData = {
        title: "Staff Records",
        totalLabel: "Total Staff:",
        total: "42",
        recentLabel: "Recent:",
        recent: "Daniel Cruz - Barber",
        updated: "Updated: Today, 11:30 AM",
        href: "/Records/StaffRecords"
    },
    inventoryData = {  
        title: "Inventory",
        totalLabel: "Total Items:",
        total: "0",
        recentLabel: "Recent:",
        recent: "No items yet",
        updated: "Updated: Just now",
        // This matches your folder path: Records/InventoryPage
        href: "/Records/InventoryPage"  
    }
}: LandingPageProps) { 
    return (
        <>
            <Header />
            <img 
                src="https://avatar.setmore.com/files/img/fnQDGUanIxuY/87d76986-7faa-4cf4-840e-4bcff5ed6256.jpeg?crop=2048;689;0;148" 
                alt="Barracks Logo" 
                className="fixed inset-0 w-full h-full object-cover -z-10" 
            />
            
            {/* grid-cols-3 makes the 3 boxes appear in one row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 p-8 min-h-screen content-center">
                <Card {...recordsData} />
                <Card {...staffData} />
                <Card {...inventoryData} /> 
                
                {/* col-span-3 makes the note bar full-width */}
                <p className="bg-gray-900/80 p-5 rounded-lg text-gray-400 md:col-span-3">
                    Note: These are hardcoded, I will replace them later with live data.
                </p>
            </div>
        </>
    )
}