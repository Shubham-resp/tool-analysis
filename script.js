const searchBtn = document.getElementById("searchBtn");
const input = document.getElementById("searchInput");

searchBtn.addEventListener("click", async () => {
  const query = input.value.trim();
  if (!query) {
    alert("Please enter a YouTube channel name.");
    return;
  }

  const API_KEY = "AIzaSyAXSNrsnp-ikNLvGqH0O4aYxLDPdbbtiPE"; // Replace with your API key

  try {
    // Search channel by name
    const searchRes = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&type=channel&q=${encodeURIComponent(
        query
      )}&maxResults=1&key=${API_KEY}`
    );
    const searchData = await searchRes.json();
    if (!searchData.items.length) {
      alert("Channel not found.");
      return;
    }

    const channel = searchData.items[0];
    const channelId = channel.snippet.channelId;

    // Get channel statistics
    const channelRes = await fetch(
      `https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics,brandingSettings&id=${channelId}&key=${API_KEY}`
    );
    const channelData = await channelRes.json();
    const info = channelData.items[0];
    const stats = info.statistics;

    const name = info.snippet.title;
    const desc = info.snippet.description;
    const img = info.snippet.thumbnails.high.url;
    const subs = parseInt(stats.subscriberCount);
    const views = parseInt(stats.viewCount);
    const videos = parseInt(stats.videoCount);
    const avgViews = videos > 0 ? Math.floor(views / videos) : 0;
    const engagement = ((avgViews / subs) * 100).toFixed(2);

    // Earning estimation logic
    let videoType = "long"; // Default to long-form
    if (desc.includes("short") || desc.includes("Shorts")) {
      videoType = "short";
    }

    const CPM = videoType === "short" ? 1.5 : 4; // Default CPM for short-form and long-form videos
    const RPM = CPM * 0.6; // Revenue per 1000 views (typically 60% of CPM)

    const monthlyEarnings = ((avgViews * RPM * 30) / 1000).toFixed(2); // Monthly earnings based on RPM

    // Update UI
    document.getElementById("channelName").textContent = name;
    document.getElementById("channelDesc").textContent =
      desc.slice(0, 120) + "...";
    document.getElementById("channelImg").src = img;

    document.getElementById("subsCount").textContent = subs.toLocaleString();
    document.getElementById("viewsCount").textContent = views.toLocaleString();
    document.getElementById("videosCount").textContent =
      videos.toLocaleString();
    document.getElementById("avgViews").textContent = avgViews.toLocaleString();
    document.getElementById("engagementScore").textContent = `${engagement}%`;

    // Show Monthly Earnings
    document.getElementById(
      "earnings"
    ).textContent = `$${monthlyEarnings} / month`;

    document.getElementById("channelCard").classList.remove("hidden");
  } catch (error) {
    alert("Something went wrong. Try again later.");
    console.error(error);
  }
});
