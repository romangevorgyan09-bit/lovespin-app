package com.amour.dating

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
}

@Composable
fun WelcomeScreen(navController: androidx.navigation.NavHostController) {
    // Jetpack Compose Welcome screen
}

@Composable
fun CardsScreen(navController: androidx.navigation.NavHostController) {
    // Jetpack Compose Cards swipe screen
}

@Composable
fun BottleScreen(navController: androidx.navigation.NavHostController) {
    // Jetpack Compose Bottle Screen
}

@Composable
fun GiftsScreen(navController: androidx.navigation.NavHostController) {
    // Jetpack Compose Gifts store
}

@Composable
fun ChatsScreen(navController: androidx.navigation.NavHostController) {
    // Jetpack Compose Chats screen
}

@Composable
fun ProfileScreen(navController: androidx.navigation.NavHostController) {
    // Jetpack Compose Profile Screen
}
