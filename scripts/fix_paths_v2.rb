require 'xcodeproj'

project_path = 'ios/SaralGita.xcodeproj'
project = Xcodeproj::Project.open(project_path)

target_name = 'SaralGita'
group_name = 'SaralGita'

files_to_fix = ['OrientationModule.swift', 'OrientationModule.m']

files_to_fix.each do |file_name|
  # Remove existing bad references
  project.main_group.recursive_children.select { |c| c.name == file_name || c.path == file_name }.each do |ref|
    ref.remove_from_project
    puts "Removed bad ref to #{ref.path}"
  end
end

target = project.targets.find { |t| t.name == target_name }
group = project.main_group.find_subpath(group_name)

if group && target
  files_to_fix.each do |file_name|
    # IMPORTANT: We explicitly set the path to include the subdirectory
    # because the group seems to not imply it, or we want to be 100% sure.
    # Actually, if we use project.new_reference calling with 'SaralGita/File.swift', it should work.
    
    full_relative_path = File.join(group_name, file_name) # "SaralGita/OrientationModule.swift"
    
    # Check if file relies on group path or project path. 
    # Safest is to add it to the group but specify the path relative to the PROJECT ROOT if source_tree is SOURCE_ROOT
    # But usually source_tree is <group>.
    
    # Strategy: Link the file using the filesystem path relative to the Xcode project 
    file_ref = group.new_file(file_name) # This usually sets path relative to group
    
    # If the group doesn't have a path set, it defaults to project root.
    # Let's check group path.
    if group.path.nil?
      puts "Group 'SaralGita' has no path set. Setting manual path for file."
      file_ref.set_path(full_relative_path)
    end
    
    target.add_file_references([file_ref])
    puts "Added correct ref for #{file_ref.path}"
  end
  project.save
  puts "Project fixed."
else
  puts "Group or Target not found."
end
