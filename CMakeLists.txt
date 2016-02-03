#
# CMake listfile to specify the build process, see:
# http://www.cmake.org/cmake/help/documentation.html
#
project(lodepng)
cmake_minimum_required(VERSION 2.8.0)

set(CMAKE_LIBRARY_PATH /opt/local/lib ${CMAKE_LIBRARY_PATH})

# Check for polluted source tree.
if(EXISTS ${CMAKE_SOURCE_DIR}/CMakeCache.txt OR
    EXISTS ${CMAKE_SOURCE_DIR}/CMakeFiles)
    message(FATAL_ERROR
        "Source directory is polluted:"
        "\n  * remove CMakeCache.txt"
        "\n  * remove CMakeFiles directory")
endif()

# Suppress in-source builds.
if(${CMAKE_SOURCE_DIR} STREQUAL ${CMAKE_BINARY_DIR})
    message(FATAL_ERROR
        "CMake generation is not allowed within the source directory:"
        "\n  * mkdir build"
        "\n  * cd build"
        "\n  * Unix-like: cmake -G \"Unix Makefiles\" .."
        "\n  * Windows: cmake -G \"Visual Studio 10\" ..")
endif()

# Adjust CMake's module path.
set(CMAKE_MODULE_PATH ${CMAKE_SOURCE_DIR}/cmake/)

# Suppress MSVC CRT warnings.
if(MSVC)
    add_definitions(-D_CRT_SECURE_NO_WARNINGS)
    add_definitions(/Za)
endif()

if (EMSCRIPTEN)
    set(CMAKE_AR "emcc")
    set(CMAKE_STATIC_LIBRARY_SUFFIX ".bc")
    set(CMAKE_C_CREATE_STATIC_LIBRARY "<CMAKE_AR> -o <TARGET> <LINK_FLAGS> <OBJECTS>")
    set(CMAKE_CXX_CREATE_STATIC_LIBRARY "<CMAKE_AR> -o <TARGET> <LINK_FLAGS> <OBJECTS>")
endif()

set(CMAKE_CXX_FLAGS "--bind -Oz -s EXPORT_NAME=\"'LodePNG'\" -s MODULARIZE=1 -s DISABLE_EXCEPTION_CATCHING=1 --memory-init-file 0 -s EXPORTED_FUNCTIONS=\"['_lodepng_decode32']\" -s TOTAL_MEMORY=5000000")

set(CMAKE_C_FLAGS "--bind -Oz -s EXPORT_NAME=\"'LodePNG'\" -s MODULARIZE=1 -s DISABLE_EXCEPTION_CATCHING=1 --memory-init-file 0 -s EXPORTED_FUNCTIONS=\"['_lodepng_decode32']\" -s TOTAL_MEMORY=500000000")

# Add lodepng library.
file(GLOB_RECURSE LODEPNG_FILES
    "./lodepng.c"
)
# include_directories("./")
#add_library(liblodepng STATIC ${LODEPNG_FILES})
#set_target_properties(liblodepng PROPERTIES PREFIX "")
#add_definitions(-DNO_ICONV=1)

add_executable(lodepng ${LODEPNG_FILES})
#target_link_libraries(lodepng liblodepng)

