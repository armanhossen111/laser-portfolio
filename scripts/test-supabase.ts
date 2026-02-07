const { createClient } = require('@supabase/supabase-js')
const dotenv = require('dotenv')
const path = require('path')

dotenv.config({ path: path.resolve(__dirname, '../.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Missing Supabase environment variables')
    process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function testFetch() {
    console.log('Testing connection to:', supabaseUrl)
    const { data, error, count } = await supabase
        .from('projects')
        .select('*', { count: 'exact' })

    if (error) {
        console.error('Error fetching projects:', error.message)
        console.error('Code:', error.code)
    } else {
        console.log('Success! Found', data?.length, 'projects.')
        console.log('Total count from Supabase:', count)
        if (data && data.length > 0) {
            console.log('First project title:', data[0].title)
            console.log('First project image URL:', data[0].image_url)
        } else {
            console.log('No projects returned. This usually means RLS policies are missing.')
        }
    }
}

testFetch()
