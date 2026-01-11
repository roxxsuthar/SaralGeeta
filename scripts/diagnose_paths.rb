require 'xcodeproj'

project_path = 'ios/SaralGita.xcodeproj'
project = Xcodeproj::Project.open(project_path)

target_name = 'SaralGita'
file_name = 'OrientationModule.swift'

puts "--- Diagnostic for #{file_name} ---"

# Find compilation build phase
target = project.targets.find { |t| t.name == target_name }
build_phase = target.source_build_phase
build_file = build_phase.files.find { |f| f.file_ref && f.file_ref.name == file_name || (f.file_ref.path && f.file_ref.path.end_with?(file_name)) }

if build_file
  puts "Build file found in Sources phase."
  ref = build_file.file_ref
  puts "Reference UUID: #{ref.uuid}"
  puts "Reference Name: #{ref.name}"
  puts "Reference Path: #{ref.path}"
  puts "Reference Source Tree: #{ref.source_tree}"
  puts "Real Path (calculated): #{ref.real_path}"
  puts "Hierarchy: #{ref.hierarchy_path}"
else
  puts "File NOT found in Sources build phase!"
end

# Find in main group (recusively)
puts "\n--- Searching in Project Groups ---"
project.main_group.recursive_children.each do |child|
  if child.isa == 'PBXFileReference' && (child.name == file_name || child.path == file_name)
    puts "Found file ref in group: #{child.parent.path || child.parent.name}"
    puts "  Path: #{child.path}"
    puts "  Real Path: #{child.real_path}"
  end
end
