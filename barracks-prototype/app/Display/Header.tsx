import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser } from '@fortawesome/free-solid-svg-icons'
import Link from 'next/link'

export default function Header() {
    return (
        <header className="flex flex-row justify-between items-center p-4 bg-gray-800 sticky top-0 z-2">
            <div className="flex flex-row items-center mx-4 gap-8">
                <Link href="/Records/CustomerRecords">
                    <h2 className="hover:scale-115 hover:font-bold hover:shadow-lg transition-transform cursor-pointer">Customer Records</h2>
                </Link>
                <Link href="/Records/StaffRecords">
                    <h2 className="hover:scale-115 hover:font-bold hover:shadow-lg transition-transform cursor-pointer">Staff Records</h2>
                </Link>
            </div>

            <div className="flex flex-row items-center gap-4">
                <span className="px-4 py-2 mx-4 rounded-lg bg-gray-700 text-white text-sm">Records Management</span>
            </div> {/* Search Feature goes here */}

            <div className="items-center mx-8 hover:scale-150 hover:font-bold hover:shadow-lg transition-transform cursor-pointer"> <FontAwesomeIcon icon={faUser} style={{color: "white"}}/> </div>
        </header>
    )
}