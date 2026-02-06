const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// Manual env loading
try {
    const envFile = fs.readFileSync(path.resolve(process.cwd(), '.env.local'), 'utf-8');
    const lines = envFile.split('\n');
    const envData = {};
    lines.forEach(line => {
        if (line.includes('=')) {
            const [key, ...valueParts] = line.split('=');
            envData[key.trim()] = valueParts.join('=').trim();
        }
    });

    const supabaseUrl = envData.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = envData.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
        console.error('Missing Supabase environment variables in .env.local');
        process.exit(1);
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    async function testFetch() {
        console.log('Testing connection to:', supabaseUrl);
        const { data, error, count } = await supabase
            .from('projects')
            .select('*', { count: 'exact' });

        if (error) {
            console.error('Error fetching projects:', error.message);
            console.error('Code:', error.code);
        } else {
            console.log('Success! Found', data ? data.length : 0, 'projects.');
            if (data && data.length > 0) {
                console.log('First project:', data[0].title);
            } else {
                console.log('Wait, 0 projects found. This means either the table is empty OR RLS is blocking SELECT.');
            }
        }
    }

    testFetch();
} catch (e) {
    console.error('Failed to read .env.local or run script:', e.message);
}
