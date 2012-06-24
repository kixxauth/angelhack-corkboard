task :default => :setup

desc "Build the test setup"
task :setup => ['node_modules/treadmill/package.json'] do
    puts "setup done"
end

desc "Run Treadmill tests"
task :test => [:setup] do
    system 'bin/runtests'
end

task :clean do
    rm_rf 'node_modules'
end

desc "Re-Load the Database with fixtures"
task :loadb do 
    sh 'node scripts/couchdb_fixtures.js --dir test/fixtures/' do |ok, id|
        ok or fail "npm could not install Node.js dependencies with npm"
    end
end

file 'node_modules/treadmill/package.json' => 'package.json' do
    sh 'npm --dev install' do |ok, id|
        ok or fail "npm could not install Node.js dependencies with npm"
    end
end
