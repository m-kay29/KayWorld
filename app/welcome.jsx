import React, { useEffect, useRef } from "react";
import {
	View,
	Text,
	StyleSheet,
	ImageBackground,
	TouchableOpacity,
	Dimensions,
	StatusBar,
	Platform,
	FlatList,
	Image,
	ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { 
	trending, 
	moviesCategory, 
	music, 
	cartoons, 
	discovery,
	popular 
} from "../data/entertainmentData";

const { width, height } = Dimensions.get("window");

export default function Welcome() {
	const router = useRouter();
	const flatListRef = useRef(null);

	useEffect(() => {
		// Hide status bar for full-screen experience
		StatusBar.setHidden(true);
		
		// Android specific status bar settings
		if (Platform.OS === 'android') {
			StatusBar.setBackgroundColor('transparent');
			StatusBar.setTranslucent(true);
		}
		
		// Restore status bar when component unmounts
		return () => {
			StatusBar.setHidden(false);
		};
	}, []);

	// Render each trending item
	const renderTrendingItem = ({ item, index }) => (
		<TouchableOpacity 
			style={styles.trendingItem}
			onPress={() => router.push({
				pathname: "/details",
				params: { 
					id: item.id, 
					title: item.title,
					rating: item.rating,
					genre: item.genre,
				}
			})}
			activeOpacity={0.8}
		>
			<Image 
				source={item.image} 
				style={styles.trendingImage}
				resizeMode="cover"
			/>
			<LinearGradient
				colors={['transparent', 'rgba(0,0,0,0.8)']}
				style={styles.trendingGradient}
			/>
			<View style={styles.trendingOverlay}>
				<Text style={styles.trendingRank}>#{index + 1}</Text>
				<View style={styles.trendingRating}>
					<Ionicons name="star" size={10} color="#FFD700" />
					<Text style={styles.trendingRatingText}>{item.rating || "8.0"}</Text>
				</View>
			</View>
			<Text style={styles.trendingTitle} numberOfLines={1}>
				{item.title}
			</Text>
		</TouchableOpacity>
	);

	// Render category card
	const renderCategoryCard = ({ item }) => {
		const categoryConfig = {
			movies: { icon: "film", color: "#E50914", screen: "/movies" },
			music: { icon: "musical-notes", color: "#1DB954", screen: "/music" },
			cartoons: { icon: "happy", color: "#FF6B6B", screen: "/cartoons" },
			discovery: { icon: "earth", color: "#FFB347", screen: "/discovery" },
		};

		const config = categoryConfig[item.category] || categoryConfig.movies;
		
		return (
			<TouchableOpacity 
				style={styles.categoryCard}
				onPress={() => router.push(config.screen)}
				activeOpacity={0.8}
			>
				<Image source={item.image} style={styles.categoryImage} />
				<LinearGradient
					colors={['transparent', 'rgba(0,0,0,0.9)']}
					style={styles.categoryGradient}
				/>
				<View style={[styles.categoryIconBadge, { backgroundColor: config.color }]}>
					<Ionicons name={config.icon} size={20} color="#fff" />
				</View>
				<Text style={styles.categoryCardTitle}>{item.title}</Text>
			</TouchableOpacity>
		);
	};

	// Prepare category data
	const categoryData = [
		{ id: 1, title: "Movies", image: moviesCategory[0]?.image || require("../assets/images/poster1.jpg"), category: "movies" },
		{ id: 2, title: "Music", image: music[0]?.image || require("../assets/images/poster2.jpg"), category: "music" },
		{ id: 3, title: "Cartoons", image: cartoons[0]?.image || require("../assets/images/poster3.jpg"), category: "cartoons" },
		{ id: 4, title: "Discovery", image: discovery[0]?.image || require("../assets/images/poster4.jpg"), category: "discovery" },
	];

	const hasTrendingMovies = trending && trending.length > 0;

	return (
		<View style={styles.container}>
			{/* Hero Section */}
			<View style={styles.heroSection}>
				<ImageBackground
					source={require("../assets/images/poster1.jpg")}
					style={styles.heroBackground}
					resizeMode="cover"
				>
					{/* Dark gradient overlay */}
					<LinearGradient
						colors={['rgba(0,0,0,0.3)', 'rgba(0,0,0,0.8)']}
						style={styles.heroOverlay}
					/>
					
					{/* Header with MrKayWorld logo and Sign In button */}
					<View style={styles.header}>
						<Text style={styles.brand}>MrKayWorld</Text>
						<TouchableOpacity
							style={styles.signIn}
							onPress={() => router.push("/login")}
							activeOpacity={0.7}
						>
							<Text style={styles.signInText}>Sign In</Text>
						</TouchableOpacity>
					</View>

					{/* Hero Content - Centered */}
					<View style={styles.heroContent}>
						<Text style={styles.heroTitle}>
							Unlimited Entertainment
						</Text>
						<Text style={styles.heroSubtitle}>
							Movies • Music • Cartoons • Discovery
						</Text>

						<TouchableOpacity
							style={styles.heroCta}
							onPress={() => router.push("/signup")}
							activeOpacity={0.8}
						>
							<Text style={styles.heroCtaText}>Get Started</Text>
						</TouchableOpacity>
						
						<Text style={styles.heroDisclaimer}>
							Join MrKayWorld today. Cancel anytime.
						</Text>
					</View>
				</ImageBackground>
			</View>

			<ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
				{/* Categories Section */}
				<View style={styles.categoriesSection}>
					<View style={styles.sectionHeader}>
						<Text style={styles.sectionTitle}>Explore Categories</Text>
						<TouchableOpacity onPress={() => router.push("/menu")}>
							<Text style={styles.seeAll}>View All</Text>
						</TouchableOpacity>
					</View>
					
					<FlatList
						data={categoryData}
						renderItem={renderCategoryCard}
						keyExtractor={(item) => item.id.toString()}
						horizontal
						showsHorizontalScrollIndicator={false}
						contentContainerStyle={styles.categoriesList}
					/>
				</View>

				{/* Trending Now Section */}
				{hasTrendingMovies && (
					<View style={styles.trendingSection}>
						<View style={styles.sectionHeader}>
							<Text style={styles.sectionTitle}>🔥 Trending Now</Text>
							<TouchableOpacity onPress={() => router.push("/trending")}>
								<Text style={styles.seeAll}>See All</Text>
							</TouchableOpacity>
						</View>
						
						<FlatList
							ref={flatListRef}
							data={trending.slice(0, 8)}
							renderItem={renderTrendingItem}
							keyExtractor={(item) => item.id.toString()}
							horizontal
							showsHorizontalScrollIndicator={false}
							contentContainerStyle={styles.trendingList}
						/>
					</View>
				)}

				{/* Popular Movies Preview */}
				{popular.length > 0 && (
					<View style={styles.popularSection}>
						<View style={styles.sectionHeader}>
							<Text style={styles.sectionTitle}>⭐ Popular Picks</Text>
							<TouchableOpacity onPress={() => router.push("/popular")}>
								<Text style={styles.seeAll}>See All</Text>
							</TouchableOpacity>
						</View>
						
						<FlatList
							data={popular.slice(0, 6)}
							renderItem={({item}) => (
								<TouchableOpacity 
									style={styles.popularCard}
									onPress={() => router.push({
										pathname: "/details",
										params: { 
											id: item.id, 
											title: item.title,
											rating: item.rating,
										}
									})}
								>
									<Image source={item.image} style={styles.popularImage} />
									<LinearGradient
										colors={['transparent', 'rgba(0,0,0,0.8)']}
										style={styles.popularGradient}
									/>
									<View style={styles.popularInfo}>
										<Text style={styles.popularTitle} numberOfLines={1}>{item.title}</Text>
										<View style={styles.popularRating}>
											<Ionicons name="star" size={10} color="#FFD700" />
											<Text style={styles.popularRatingText}>{item.rating || "8.0"}</Text>
										</View>
									</View>
								</TouchableOpacity>
							)}
							keyExtractor={(item) => item.id.toString()}
							horizontal
							showsHorizontalScrollIndicator={false}
							contentContainerStyle={styles.popularList}
						/>
					</View>
				)}

				{/* Bottom Spacing */}
				<View style={{ height: 30 }} />
			</ScrollView>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#000',
	},
	scrollView: {
		flex: 1,
		backgroundColor: '#000',
	},
	// Hero Section
	heroSection: {
		height: height * 0.65,
		width: width,
	},
	heroBackground: {
		flex: 1,
		width: width,
		height: height * 0.65,
	},
	heroOverlay: {
		...StyleSheet.absoluteFillObject,
	},
	header: {
		position: "absolute",
		top: Platform.OS === 'ios' ? 50 : 30,
		left: 0,
		right: 0,
		zIndex: 10,
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		paddingHorizontal: 20,
	},
	brand: {
		color: "#E50914",
		fontSize: 28,
		fontWeight: "800",
		letterSpacing: 1,
		textShadowColor: "rgba(0,0,0,0.5)",
		textShadowOffset: { width: 2, height: 2 },
		textShadowRadius: 4,
	},
	signIn: {
		paddingVertical: 8,
		paddingHorizontal: 16,
		borderRadius: 4,
		backgroundColor: "#E50914",
	},
	signInText: {
		color: "#fff",
		fontWeight: "600",
		fontSize: 14,
		letterSpacing: 0.5,
	},
	heroContent: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		paddingHorizontal: 24,
		paddingBottom: 40,
	},
	heroTitle: {
		color: "#fff",
		fontSize: 40,
		fontWeight: "800",
		textAlign: "center",
		marginBottom: 12,
		lineHeight: 48,
		textShadowColor: "rgba(0,0,0,0.5)",
		textShadowOffset: { width: 2, height: 2 },
		textShadowRadius: 4,
	},
	heroSubtitle: {
		color: "#fff",
		fontSize: 18,
		textAlign: "center",
		marginBottom: 30,
		opacity: 0.9,
		textShadowColor: "rgba(0,0,0,0.5)",
		textShadowOffset: { width: 1, height: 1 },
		textShadowRadius: 2,
	},
	heroCta: {
		backgroundColor: "#E50914",
		paddingVertical: 16,
		paddingHorizontal: 32,
		borderRadius: 4,
		width: width * 0.7,
		alignItems: "center",
		marginBottom: 16,
		elevation: 5,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.25,
		shadowRadius: 3.84,
	},
	heroCtaText: {
		color: "#fff",
		fontSize: 18,
		fontWeight: "700",
		letterSpacing: 0.5,
	},
	heroDisclaimer: {
		color: "#fff",
		fontSize: 12,
		textAlign: "center",
		opacity: 0.7,
		maxWidth: width * 0.8,
	},
	
	// Section Styles
	sectionHeader: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingHorizontal: 16,
		marginBottom: 12,
	},
	sectionTitle: {
		color: '#fff',
		fontSize: 20,
		fontWeight: '700',
	},
	seeAll: {
		color: '#E50914',
		fontSize: 14,
		fontWeight: '600',
	},

	// Categories Section
	categoriesSection: {
		marginTop: -20,
		paddingTop: 20,
		backgroundColor: '#000',
	},
	categoriesList: {
		paddingHorizontal: 16,
	},
	categoryCard: {
		width: width * 0.4,
		height: height * 0.2,
		marginRight: 12,
		borderRadius: 12,
		overflow: 'hidden',
		position: 'relative',
	},
	categoryImage: {
		width: '100%',
		height: '100%',
	},
	categoryGradient: {
		position: 'absolute',
		bottom: 0,
		left: 0,
		right: 0,
		height: '100%',
	},
	categoryIconBadge: {
		position: 'absolute',
		top: 12,
		right: 12,
		width: 36,
		height: 36,
		borderRadius: 18,
		justifyContent: 'center',
		alignItems: 'center',
	},
	categoryCardTitle: {
		position: 'absolute',
		bottom: 12,
		left: 12,
		color: '#fff',
		fontSize: 18,
		fontWeight: '700',
		textShadowColor: 'rgba(0,0,0,0.5)',
		textShadowOffset: { width: 1, height: 1 },
		textShadowRadius: 2,
	},

	// Trending Section
	trendingSection: {
		marginTop: 24,
	},
	trendingList: {
		paddingLeft: 16,
	},
	trendingItem: {
		width: width * 0.35,
		marginRight: 10,
		position: 'relative',
	},
	trendingImage: {
		width: width * 0.35,
		height: height * 0.18,
		borderRadius: 8,
	},
	trendingGradient: {
		position: 'absolute',
		bottom: 0,
		left: 0,
		right: 0,
		height: 80,
		borderBottomLeftRadius: 8,
		borderBottomRightRadius: 8,
	},
	trendingOverlay: {
		position: 'absolute',
		top: 8,
		left: 8,
		right: 8,
		flexDirection: 'row',
		justifyContent: 'space-between',
	},
	trendingRank: {
		color: '#fff',
		fontSize: 12,
		fontWeight: '800',
		backgroundColor: '#E50914',
		paddingHorizontal: 8,
		paddingVertical: 4,
		borderRadius: 4,
	},
	trendingRating: {
		backgroundColor: 'rgba(0,0,0,0.7)',
		paddingHorizontal: 6,
		paddingVertical: 4,
		borderRadius: 4,
		flexDirection: 'row',
		alignItems: 'center',
		gap: 2,
	},
	trendingRatingText: {
		color: '#FFD700',
		fontSize: 10,
		fontWeight: '600',
	},
	trendingTitle: {
		color: '#fff',
		fontSize: 12,
		fontWeight: '600',
		marginTop: 6,
		paddingHorizontal: 4,
	},

	// Popular Section
	popularSection: {
		marginTop: 24,
	},
	popularList: {
		paddingLeft: 16,
	},
	popularCard: {
		width: 100,
		marginRight: 10,
		position: 'relative',
	},
	popularImage: {
		width: 100,
		height: 140,
		borderRadius: 8,
	},
	popularGradient: {
		position: 'absolute',
		bottom: 0,
		left: 0,
		right: 0,
		height: 60,
		borderBottomLeftRadius: 8,
		borderBottomRightRadius: 8,
	},
	popularInfo: {
		position: 'absolute',
		bottom: 8,
		left: 8,
		right: 8,
	},
	popularTitle: {
		color: '#fff',
		fontSize: 11,
		fontWeight: '600',
		marginBottom: 2,
	},
	popularRating: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 2,
	},
	popularRatingText: {
		color: '#FFD700',
		fontSize: 9,
		fontWeight: '600',
	},

	emptyTrending: {
		height: height * 0.18,
		justifyContent: 'center',
		alignItems: 'center',
	},
	emptyTrendingText: {
		color: '#666',
		fontSize: 14,
	},
});