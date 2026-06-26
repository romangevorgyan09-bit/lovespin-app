import React, { useState } from 'react';
import { FileCode, Copy, Check, ChevronRight, Folder, FolderOpen, Terminal } from 'lucide-react';

interface FileNode {
  name: string;
  type: 'file' | 'directory';
  path: string;
  children?: FileNode[];
  content?: string;
}

export default function SourceCodeViewer() {
  const [selectedFilePath, setSelectedFilePath] = useState('/android/app/src/main/java/com/amour/dating/MainActivity.kt');
  const [copied, setCopied] = useState(false);
  const [openDirs, setOpenDirs] = useState<{ [key: string]: boolean }>({
    'root': true,
    '/android': true,
    '/android/app': true,
    '/android/app/src': true,
    '/android/app/src/main': true,
    '/android/app/src/main/java': true,
    '/android/app/src/main/java/com': true,
    '/android/app/src/main/java/com/amour': true,
    '/android/app/src/main/java/com/amour/dating': true,
  });

  const fileTree: FileNode = {
    name: 'LoveSpin-AndroidProject',
    type: 'directory',
    path: 'root',
    children: [
      {
        name: 'build.gradle',
        type: 'file',
        path: '/android/build.gradle',
        content: `// Top-level build file where you can add configuration options common to all sub-projects/modules.
buildscript {
    ext {
        compose_version = '1.5.4'
        kotlin_version = '1.9.20'
    }
    repositories {
        google()
        mavenCentral()
    }
    dependencies {
        classpath 'com.android.tools.build:gradle:8.1.2'
        classpath "org.jetbrains.kotlin:kotlin-gradle-plugin:$kotlin_version"
        classpath 'com.google.gms:google-services:4.4.0'
    }
}

allprojects {
    repositories {
        google()
        mavenCentral()
    }
}

task clean(type: Delete) {
    delete rootProject.buildDir
}`
      },
      {
        name: 'settings.gradle',
        type: 'file',
        path: '/android/settings.gradle',
        content: `pluginManagement {
    repositories {
        google()
        mavenCentral()
        gradlePluginPortal()
    }
}
dependencyResolutionManagement {
    repositoriesMode.set(RepositoriesMode.FAIL_ON_PROJECT_REPOS)
    repositories {
        google()
        mavenCentral()
    }
}
rootProject.name = "LoveSpin"
include ':app'`
      },
      {
        name: 'app',
        type: 'directory',
        path: '/android/app',
        children: [
          {
            name: 'build.gradle',
            type: 'file',
            path: '/android/app/build.gradle',
            content: `plugins {
    id 'com.android.application'
    id 'org.jetbrains.kotlin.android'
    id 'com.google.gms.google-services'
}

android {
    namespace 'com.amour.dating'
    compileSdk 34

    defaultConfig {
        applicationId "com.amour.dating"
        minSdk 26
        targetSdk 34
        versionCode 1
        versionName "1.0.0"

        testInstrumentationRunner "androidx.test.runner.AndroidJUnitRunner"
        vectorDrawables {
            useSupportLibrary true
        }
    }

    buildTypes {
        release {
            minifyEnabled true
            proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
        }
    }
    compileOptions {
        sourceCompatibility JavaVersion.VERSION_17
        targetCompatibility JavaVersion.VERSION_17
    }
    kotlinOptions {
        jvmTarget = '17'
    }
    buildFeatures {
        compose true
    }
    composeOptions {
        kotlinCompilerExtensionVersion '1.5.4'
    }
    packagingOptions {
        resources {
            excludes += '/META-INF/{AL2.0,LGPL2.1}'
        }
    }
}

dependencies {
    implementation 'androidx.core:core-ktx:1.12.0'
    implementation 'androidx.lifecycle:lifecycle-runtime-ktx:2.6.2'
    implementation 'androidx.activity:activity-compose:1.8.1'
    
    // Compose
    implementation platform('androidx.compose:compose-bom:2023.10.01')
    implementation 'androidx.compose.ui:ui'
    implementation 'androidx.compose.ui:ui-graphics'
    implementation 'androidx.compose.ui:ui-tooling-preview'
    implementation 'androidx.compose.material3:material3'
    implementation 'androidx.navigation:navigation-compose:2.7.5'
    
    // Firebase
    implementation platform('com.google.firebase:firebase-bom:32.6.0')
    implementation 'com.google.firebase:firebase-auth-ktx'
    implementation 'com.google.firebase:firebase-firestore-ktx'
    implementation 'com.google.firebase:firebase-storage-ktx'
    implementation 'com.google.firebase:firebase-messaging-ktx'

    // Coil for Image Loading
    implementation 'io.coil-kt:coil-compose:2.5.0'

    testImplementation 'junit:junit:4.13.2'
    androidTestImplementation 'androidx.test.ext:junit:1.1.5'
    androidTestImplementation 'androidx.test.espresso:espresso-core:3.5.1'
    androidTestImplementation platform('androidx.compose:compose-bom:2023.10.01')
    androidTestImplementation 'androidx.compose.ui:ui-test-junit4'
    debugImplementation 'androidx.compose.ui:ui-tooling'
    debugImplementation 'androidx.compose.ui:ui-test-manifest'
}`
          },
          {
            name: 'src',
            type: 'directory',
            path: '/android/app/src',
            children: [
              {
                name: 'main',
                type: 'directory',
                path: '/android/app/src/main',
                children: [
                  {
                    name: 'AndroidManifest.xml',
                    type: 'file',
                    path: '/android/app/src/main/AndroidManifest.xml',
                    content: `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.amour.dating">

    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
    <uses-permission android:name="android.permission.POST_NOTIFICATIONS" />
    <uses-permission android:name="android.permission.READ_MEDIA_IMAGES" />

    <application
        android:allowBackup="true"
        android:icon="@mipmap/ic_launcher"
        android:label="@string/app_name"
        android:roundIcon="@mipmap/ic_launcher_round"
        android:supportsRtl="true"
        android:theme="@style/Theme.LoveSpin"
        android:hardwareAccelerated="true">
        
        <activity
            android:name=".MainActivity"
            android:exported="true"
            android:theme="@style/Theme.LoveSpin.NoActionBar"
            android:screenOrientation="portrait">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
        
    </application>

</manifest>`
                  },
                  {
                    name: 'java',
                    type: 'directory',
                    path: '/android/app/src/main/java',
                    children: [
                      {
                        name: 'com.amour.dating',
                        type: 'directory',
                        path: '/android/app/src/main/java/com/amour/dating',
                        children: [
                          {
                            name: 'MainActivity.kt',
                            type: 'file',
                            path: '/android/app/src/main/java/com/amour/dating/MainActivity.kt',
                            content: `package com.amour.dating

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.currentBackStackEntryAsState
import androidx.navigation.compose.rememberNavController
import com.amour.dating.ui.theme.LoveSpinTheme

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            LoveSpinTheme {
                val navController = rememberNavController()
                val navBackStackEntry by navController.currentBackStackEntryAsState()
                val currentRoute = navBackStackEntry?.destination?.route

                Scaffold(
                    modifier = Modifier.fillMaxSize(),
                    bottomBar = {
                        if (currentRoute != "welcome") {
                            BottomNavigationBar(navController, currentRoute)
                        }
                    }
                ) { innerPadding ->
                    NavHost(
                        navController = navController,
                        startDestination = "welcome",
                        modifier = Modifier.padding(innerPadding)
                    ) {
                        composable("welcome") { WelcomeScreen(navController) }
                        composable("cards") { CardsScreen(navController) }
                        composable("spin") { BottleScreen(navController) }
                        composable("gifts") { GiftsScreen(navController) }
                        composable("chats") { ChatsScreen(navController) }
                        composable("profile") { ProfileScreen(navController) }
                    }
                }
            }
        }
    }
}

@Composable
fun BottomNavigationBar(navController: androidx.navigation.NavHostController, currentRoute: String?) {
    NavigationBar {
        NavigationBarItem(
            selected = currentRoute == "cards",
            onClick = { navController.navigate("cards") },
            label = { Text("Анкеты") },
            icon = { Text("🎴") }
        )
        NavigationBarItem(
            selected = currentRoute == "spin",
            onClick = { navController.navigate("spin") },
            label = { Text("Бутылочка") },
            icon = { Text("🍾") }
        )
        NavigationBarItem(
            selected = currentRoute == "gifts",
            onClick = { navController.navigate("gifts") },
            label = { Text("Магазин") },
            icon = { Text("🎁") }
        )
        NavigationBarItem(
            selected = currentRoute == "chats",
            onClick = { navController.navigate("chats") },
            label = { Text("Чаты") },
            icon = { Text("💬") }
        )
        NavigationBarItem(
            selected = currentRoute == "profile",
            onClick = { navController.navigate("profile") },
            label = { Text("Профиль") },
            icon = { Text("👤") }
        )
    }
}`
                          }
                        ]
                      }
                    ]
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  };

  const findFileContent = (tree: FileNode, path: string): string => {
    if (tree.path === path && tree.content) return tree.content;
    if (tree.children) {
      for (const child of tree.children) {
        const found = findFileContent(child, path);
        if (found) return found;
      }
    }
    return '';
  };

  const handleCopy = () => {
    const content = findFileContent(fileTree, selectedFilePath);
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const toggleDir = (path: string) => {
    setOpenDirs(prev => ({ ...prev, [path]: !prev[path] }));
  };

  const renderTree = (node: FileNode) => {
    if (node.type === 'file') {
      const isSelected = selectedFilePath === node.path;
      return (
        <button
          key={node.path}
          onClick={() => setSelectedFilePath(node.path)}
          className={`w-full flex items-center gap-2 px-3 py-1.5 text-xs rounded-md transition-all text-left ${
            isSelected
              ? 'bg-purple-950/40 text-purple-400 border-l-2 border-purple-500 font-medium'
              : 'text-zinc-400 hover:bg-zinc-800/40 hover:text-zinc-200'
          }`}
        >
          <FileCode size={14} className={isSelected ? 'text-purple-400' : 'text-zinc-500'} />
          <span className="truncate">{node.name}</span>
        </button>
      );
    }

    const isOpen = openDirs[node.path];
    return (
      <div key={node.path} className="pl-2">
        <button
          onClick={() => toggleDir(node.path)}
          className="w-full flex items-center gap-1.5 px-2 py-1.5 text-xs text-zinc-300 hover:bg-zinc-800/30 rounded-md transition-all text-left font-medium"
        >
          <ChevronRight
            size={12}
            className={`text-zinc-500 transition-transform duration-200 ${isOpen ? 'rotate-90' : ''}`}
          />
          {isOpen ? (
            <FolderOpen size={14} className="text-amber-500/80" />
          ) : (
            <Folder size={14} className="text-amber-500/80" />
          )}
          <span>{node.name}</span>
        </button>
        {isOpen && node.children && (
          <div className="mt-1 ml-1 border-l border-zinc-800/60 pl-1.5 flex flex-col gap-0.5">
            {node.children.map(child => renderTree(child))}
          </div>
        )}
      </div>
    );
  };

  const currentContent = findFileContent(fileTree, selectedFilePath);

  return (
    <div className="bg-zinc-950 border border-zinc-800/80 rounded-2xl p-5 shadow-2xl flex flex-col h-[520px]">
      <div className="flex items-center justify-between border-b border-zinc-800/60 pb-3 mb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 bg-purple-950/60 rounded-lg text-purple-400">
            <Terminal size={18} />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-zinc-100">Android Source Explorer</h3>
            <p className="text-xs text-zinc-500 font-mono">build.gradle, MainActivity.kt, manifests</p>
          </div>
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white px-3 py-1.5 rounded-lg border border-zinc-800 text-xs transition-all cursor-pointer font-medium"
        >
          {copied ? (
            <>
              <Check size={13} className="text-emerald-400" />
              <span className="text-emerald-400 font-semibold">Copied!</span>
            </>
          ) : (
            <>
              <Copy size={13} />
              <span>Copy Code</span>
            </>
          )}
        </button>
      </div>

      <div className="grid grid-cols-12 gap-4 flex-1 overflow-hidden">
        {/* Left Tree Explorer */}
        <div className="col-span-4 bg-zinc-900/40 rounded-xl border border-zinc-800/40 p-2 overflow-y-auto max-h-full">
          <div className="text-[10px] font-bold text-zinc-600 tracking-wider uppercase px-2 py-1 mb-2">
            Project Tree
          </div>
          {renderTree(fileTree)}
        </div>

        {/* Right Code Display */}
        <div className="col-span-8 flex flex-col bg-zinc-900/20 rounded-xl border border-zinc-800/30 overflow-hidden max-h-full relative">
          <div className="bg-zinc-950/70 border-b border-zinc-800/40 px-4 py-2 flex items-center justify-between">
            <span className="text-[11px] text-zinc-500 font-mono select-none">{selectedFilePath}</span>
            <span className="text-[10px] bg-purple-950/50 text-purple-400 border border-purple-900/40 px-1.5 py-0.5 rounded uppercase tracking-wider font-bold">
              {selectedFilePath.split('.').pop()}
            </span>
          </div>
          <pre className="p-4 overflow-auto font-mono text-[11px] text-zinc-300 flex-1 leading-relaxed whitespace-pre-wrap select-text selection:bg-purple-900/60 max-h-[350px]">
            {currentContent}
          </pre>
        </div>
      </div>
    </div>
  );
}
