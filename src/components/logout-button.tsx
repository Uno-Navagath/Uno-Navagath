'use client'
import React from 'react';
import {Button} from "@/components/ui/button";
import {signOut} from "@/lib/supabase/actions/logout-action";

function LogoutButton() {
    const [loading, setLoading] = React.useState(false);

    return (
        <Button
            variant="destructive"
            disabled={loading}
            onClick={async () => {
                setLoading(true);
                console.log('Logging out...');
                await signOut(`${window.location.origin}/`)
                setLoading(false);
            }}
        >
            {loading ? 'Logging out...' : 'Logout'}
        </Button>
    );
}

export default LogoutButton;