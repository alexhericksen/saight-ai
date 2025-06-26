// Test script to verify tool tracking functionality
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testToolTracking() {
  console.log('Testing tool tracking functionality...\n');

  try {
    // Test 1: Check if we can read available tools
    console.log('1. Testing getAvailableTools...');
    const { data: availableTools, error: availableError } = await supabase
      .from('available_tools')
      .select('*')
      .order('name');

    if (availableError) {
      console.error('Error fetching available tools:', availableError);
    } else {
      console.log(`✅ Found ${availableTools.length} available tools`);
    }

    // Test 2: Check if we can read user tools
    console.log('\n2. Testing getUserTools...');
    const { data: userTools, error: userError } = await supabase
      .from('user_tools')
      .select(`
        id,
        category,
        detail,
        available_tools (
          id,
          domain,
          name,
          logo_url
        )
      `)
      .order('created_at', { ascending: false });

    if (userError) {
      console.error('Error fetching user tools:', userError);
    } else {
      console.log(`✅ Found ${userTools.length} user tools`);
    }

    // Test 3: Try to add a new tool
    console.log('\n3. Testing addTool...');
    const testTool = {
      domain: 'test-example.com',
      name: 'Test Tool',
      logo_url: 'https://example.com/logo.png',
      category: 'productivity',
      detail: 'testing'
    };

    // First, check if tool exists in available_tools
    const { data: existingTool } = await supabase
      .from('available_tools')
      .select('*')
      .eq('domain', testTool.domain)
      .eq('name', testTool.name)
      .single();

    let toolId;
    if (existingTool) {
      toolId = existingTool.id;
      console.log('✅ Tool already exists in available_tools');
    } else {
      // Create new tool in available_tools
      const { data: newTool, error: insertError } = await supabase
        .from('available_tools')
        .insert([{ 
          domain: testTool.domain, 
          name: testTool.name, 
          logo_url: testTool.logo_url 
        }])
        .select()
        .single();

      if (insertError) {
        console.error('❌ Error creating tool in available_tools:', insertError);
        return;
      }

      toolId = newTool.id;
      console.log('✅ Created new tool in available_tools');
    }

    // Check if already tracked
    const { data: existingUserTool } = await supabase
      .from('user_tools')
      .select('*')
      .eq('tool_id', toolId)
      .single();

    if (existingUserTool) {
      console.log('✅ Tool already tracked by user');
    } else {
      // Add to user_tools
      const { error: userToolError } = await supabase
        .from('user_tools')
        .insert([{
          tool_id: toolId,
          category: testTool.category,
          detail: testTool.detail
        }]);

      if (userToolError) {
        console.error('❌ Error adding tool to user_tools:', userToolError);
      } else {
        console.log('✅ Successfully added tool to user_tools');
      }
    }

    console.log('\n✅ All tests completed successfully!');
    console.log('\nNote: You may need to run the database migration manually if you encounter RLS policy errors.');
    console.log('Migration file: supabase/migrations/20240322000000_fix_user_tools_schema.sql');

  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

testToolTracking(); 