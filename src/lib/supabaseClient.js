import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://qluplzkpyxieclohsrih.supabase.co'
const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_B8Hi9FarlnXxbcZhIxjLLg_mvr-SFqX'

export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY)
export const FUNCTIONS_URL = `${SUPABASE_URL}/functions/v1`
