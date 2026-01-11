require 'xcodeproj'

project_path = 'ios/SaralGita.xcodeproj'
project = Xcodeproj::Project.open(project_path)

target_name = 'SaralGita'
target = project.targets.find { |t| t.name == target_name }

if target
  group_name = 'SaralGita'
  group = project.main_group.find_subpath(group_name, true)
  
  files_to_add = ['OrientationModule.swift', 'OrientationModule.m']
  
  files_to_add.each do |file_name|
    file_path = File.join(group_name, file_name)
    # Check if file exists in file system
    if File.exist?(File.join('ios', file_path))
      # Create file reference
      file_ref = group.new_reference(file_name)
      # Add to sources build phase
      target.add_file_references([file_ref])
      puts "Added #{file_name} to #{target_name}"
    else
      puts "File not found: #{file_path}"
    end
  end
  
  project.save
  puts "Project saved."
else
  puts "Target #{target_name} not found."
end
