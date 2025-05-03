document.querySelector("button").addEventListener("click", async () => {
  const username = document.querySelector("input").value;
  if (!username) return alert("Please enter a channel username.");

  const apiKey = "YOUR_YOUTUBE_API_KEY"; // Replace with your actual API key
  const statsDiv = document.querySelector(".stats");
  const earningsDiv = document.querySelector(".earnings");
  statsDiv.innerHTML = "Loading...";
  earningsDiv.innerHTML = "";

  try {
    // Get channel ID from username
    const res1 = await fetch(`https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&forUsername=${username}&key=${apiKey}`);
    const data1 = await res1.json();
    
    let channel = data1.items[0];
    
    // If username not found, try search by channel name
    if (!channel) {
      const res2 = await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&type=channel&q=${username}&key=${apiKey}`);
      const data2 = await res2.json();
      const channelId = data2.items[0]?.snippet?.channelId;
      if (!channelId) throw new Error("Channel not found.");

      const res3 = await fetch(`https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&id=${channelId}&key=${apiKey}`);
      const data3 = await res3.json();
      channel = data3.items[0];
    }

    const title = channel.snippet.title;
    const subscribers = channel.statistics.subscriberCount;
    const views = channel.statistics.viewCount;
    const videos = channel.statistics.videoCount;
    const profileImg = channel.snippet.thumbnails.default.url;

    statsDiv.innerHTML = `
      <div class="channel-info">
        <img src="${profileImg}" alt="Channel Image" class="channel-img">
        <div>
          <h3>${title}</h3>
          <p><strong>Subscribers:</strong> ${parseInt(subscribers).toLocaleString()}</p>
          <p><strong>Total Views:</strong> ${parseInt(views).toLocaleString()}</p>
          <p><strong>Videos:</strong> ${videos}</p>
          <p><strong>Business Email:</strong> Not public / Check channel 'About' section</p>
        </div>
      </div>
    `;

    // Estimate Earnings (Assuming mostly long-form videos)
    const averageCPM = 150; // INR per 1000 views
    const estimatedRPM = 80; // INR per 1000 views actually earned by creator
    const estimatedMonthlyViews = parseInt(views) / (parseInt(videos) || 1) * 10; // crude logic: avg views * 10 recent uploads

    const estimatedMonthlyEarnings = (estimatedMonthlyViews / 1000) * estimatedRPM;

    earningsDiv.innerHTML = `
      <div class="earnings">
        <h3>Estimated Monthly Earnings</h3>
        <p class="earnings-value">₹${Math.floor(estimatedMonthlyEarnings).toLocaleString()}</p>
        <p><small>💡 Based on average RPM of ₹${estimatedRPM}/1000 views for long-form videos.</small></p>
        <p><small>📌 CPM ≈ ₹${averageCPM} | RPM ≈ ₹${estimatedRPM}</small></p>
        <p><small>Views estimated from past content and total views.</small></p>
      </div>
    `;

  } catch (error) {
    statsDiv.innerHTML = "Channel not found or error occurred.";
    console.error(error);
  }
});
