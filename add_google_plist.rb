#!/usr/bin/env ruby

require 'xcodeproj'

project_path = 'ios/SaralGita.xcodeproj'
project = Xcodeproj::Project.open(project_path)

# Get the main target
target = project.targets.first

# Get the main group
main_group = project.main_group['SaralGita']

# Check if GoogleService-Info.plist already exists
existing_file = main_group.files.find { |f| f.path == 'GoogleService-Info.plist' }

if existing_file.nil?
  # Add GoogleService-Info.plist to the project
  file_ref = main_group.new_reference('GoogleService-Info.plist')
  file_ref.last_known_file_type = 'text.plist.xml'
  
  # Add to Resources build phase
  target.resources_build_phase.add_file_reference(file_ref)
  
  project.save
  
  puts " GoogleService-Info.plist added to Xcode project"
else
  puts " GoogleService-Info.plist already exists in the project"
end
