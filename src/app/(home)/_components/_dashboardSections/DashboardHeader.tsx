"use client";

import {useState} from "react";
import {Menu, Moon, Sun, X} from "lucide-react";
import LogoutButton from "@/components/logout-button";
import {User} from "@supabase/supabase-js";
import {UserAvatar} from "@/components/user-avatar";

export default function DashboardHeader({user}: { user: User }) {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [darkMode, setDarkMode] = useState(false);

    return (
        <header className="sticky top-0 z-50 bg-white dark:bg-gray-900 shadow">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                    {/* Left: Brand */}
                    <div className="flex items-center space-x-2">
            <span className="text-2xl font-extrabold text-indigo-600">
              🎮 GameHub
            </span>
                    </div>

                    {/* Middle: Search (hidden on small screens) */}
                    <div className="hidden md:flex flex-1 justify-center">
                        <input
                            type="text"
                            placeholder="Search games, players..."
                            className="w-96 rounded-lg border border-gray-300 px-3 py-1 text-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                        />
                    </div>

                    {/* Right: User + Actions */}
                    <div className="flex items-center space-x-4">
                        {/* Dark mode toggle */}
                        <button
                            onClick={() => setDarkMode(!darkMode)}
                            className="rounded-full p-2 hover:bg-gray-100 dark:hover:bg-gray-800"
                        >
                            {darkMode ? (
                                <Sun className="h-5 w-5 text-yellow-500"/>
                            ) : (
                                <Moon className="h-5 w-5 text-gray-600 dark:text-gray-300"/>
                            )}
                        </button>

                        {/* User profile */}
                        <div className="relative group">
                            <button
                                className="flex items-center space-x-2 rounded-full bg-gray-100 px-3 py-1 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700">
                                <UserAvatar imageUrl={user?.user_metadata?.avatar_url}/>
                                <span className="hidden sm:inline text-sm font-medium text-gray-700 dark:text-gray-200">
                  {user?.email}
                </span>
                            </button>

                            {/* Dropdown */}
                            <div
                                className="absolute right-0 mt-2 hidden w-48 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 group-hover:block dark:bg-gray-800">
                                <div className="py-2">
                                    <button
                                        className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700">
                                        Settings
                                    </button>
                                    <LogoutButton/>
                                </div>
                            </div>
                        </div>

                        {/* Mobile menu button */}
                        <button
                            className="md:hidden rounded-md p-2 hover:bg-gray-100 dark:hover:bg-gray-800"
                            onClick={() => setMobileOpen(!mobileOpen)}
                        >
                            {mobileOpen ? (
                                <X className="h-6 w-6"/>
                            ) : (
                                <Menu className="h-6 w-6"/>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            {mobileOpen && (
                <div className="md:hidden border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
                    <div className="space-y-2 px-4 py-3">
                        <input
                            type="text"
                            placeholder="Search..."
                            className="w-full rounded-lg border border-gray-300 px-3 py-1 text-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                        />
                        <button
                            className="block w-full px-3 py-2 text-left text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800">
                            Settings
                        </button>
                        <LogoutButton/>
                    </div>
                </div>
            )}
        </header>
    );
}
