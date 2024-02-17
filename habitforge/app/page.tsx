import Image from "next/image";
import Typography from "@/components/ui/typography-variants";
import { Zap, Sparkles, Eye, TrendingUpIcon, Users } from "lucide-react";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="flex flex-col items-center gap-9">

        {/* Hero Section */}
        <div className="flex flex-col items-center gap-9">
          <div className="BlueBorder">
            <Typography variant="p" style={{
              fontWeight: 'bold', fontSize: '12px', borderRadius: '17px', color: '#2563EB',
              backgroundColor: '#DBEAFE', textAlign: 'center', padding: '10px', display: 'inline'
            }}>
              Small habits, big impact; your daily choices shape your destiny.
            </Typography>
          </div>
          <Typography variant="h1" style={{ textAlign: 'center'}}>Forge a better life one habit at a time.</Typography>
          <Typography variant="p" style={{ color: '#949494' }}>Start your journey of accomplishing any challenge by tracking your habits with HabitForge</Typography>
          <button style={{ background: '#2563EB', color: 'white', padding: '10px', borderRadius: '10px' }}>
            <Typography variant="h4">Get Started For Free</Typography>
          </button>
        </div>

        {/* Demo Section */}
        <div className="centered-section flex flex-col items-center" style={{ backgroundImage: 'url(blocs.svg)', backgroundSize: 'cover', backgroundPosition: 'center', width: '100%', marginBottom: '3%' }}>
          <Image src="HeroImage.svg" alt="Description" width={1200} height={200} />
        </div>

        {/* 3 List Section */}
        <div className="flex justify-center gap-15">
          <div className="section flex flex-col items-center text-center">
            <div className="icon" style={{ background: '#E1F0FF', padding: '15px', borderRadius: '100%', marginBottom: '3%' }}>
              <Zap size={32} color="#0091FF" />
            </div>
            <Typography variant="h3">Stay motivated to complete your habits</Typography>
            <Typography variant="p">Stay motivated to complete your habits by earning rewards at every completion.</Typography>
          </div>
          <div className="section flex flex-col items-center text-center">
            <div className="icon" style={{ background: '#FFF8BB', padding: '15px', borderRadius: '100%', marginBottom: '3%' }}>
              <Sparkles size={32} color="#FFA01C" />
            </div>
            <Typography variant="h3">Aim for the stars</Typography>
            <Typography variant="p">Challenge yourself to achieve even the hardest goal, and we promise to keep you motivated.</Typography>
          </div>
          <div className="section flex flex-col items-center text-center">
            <div className="icon" style={{ background: '#DCFCE7', padding: '15px', borderRadius: '100%', marginBottom: '3%' }}>
              <Eye size={32} color="#26C661" />
            </div>
            <Typography variant="h3">View your progress</Typography>
            <Typography variant="p">With the help of our daily logs and graphs, you can visualize your journey.</Typography>
          </div>
        </div>

        {/* Leaderboard Section */}

        <div className="flex items-center justify-center">
          <div className="image p-14">
            <Image src="Leaderboard.svg" alt="Person Pointing" width={500} height={32} />
          </div>

          <div className="LeaderBoardInfo w-[40%] p-40">
            <div className="icon static" >
              <TrendingUpIcon size={64} color="#F76808" className="" style={{ background: '#FFE8D7', padding: '15px', borderRadius: '100%', marginBottom: '4%' }} />
            </div>
            <Typography variant="h2">Get on the leaderboard</Typography>
            <Typography variant="p" style={{ color: '#949494' }}>Complete your habits and keep your streak going to improve your rank and try to beat the global leaderboards.</Typography>
            <ul>
              <li><Typography variant="p">✔ Create habits</Typography></li>
              <li><Typography variant="p">✔ Keep your streak going</Typography></li>
              <li><Typography variant="p">✔ Become the #1 ranked HabitForger</Typography></li>
            </ul>
          </div>
        </div>

        {/* Challenges */}

        <div className="flex items-center justify-center">
          <div className="w-[40%] p-40">
            <div className="icon static" >
              <Users size={64} color="#26C661" className="" style={{ background: '#E1F0FF', padding: '15px', borderRadius: '100%', marginBottom: '4%' }} />
            </div>
            <Typography variant="h2">Create group challenges</Typography>
            <Typography variant="p" style={{ color: '#949494' }}>Invite your friends to complete habits set as a group. Hold each other accountable and add some fun to habit forming.</Typography>
            <ul>
              <li><Typography variant="p">✔ Challenge your freinds</Typography></li>
              <li><Typography variant="p">✔ Make habit forming fun</Typography></li>
              <li><Typography variant="p">✔ Reach the top rank in your group</Typography></li>
            </ul>
          </div>
          <div className="image p-14">
            <Image src="GroupChallenges.svg" alt="Person Pointing" width={500} height={32} />
          </div>
        </div>


        {/* Call to action section */}
        <div className="flex flex-col items-center gap-9" style={{ marginTop: '7%' }}>
          <Typography variant="h1" style={{ textAlign: 'center'}}>HabitForge is free forever</Typography>
          <Typography variant="p" style={{ color: '#949494' }}>HabitForge is completely free for habit formers like you! </Typography>
          <button style={{ background: '#2563EB', color: 'white', padding: '10px', borderRadius: '10px' }}>
            <Typography variant="h4">Get Started</Typography>
          </button>
          <ul className="flex flex-col items-center gap-3">
            <li><Typography variant="p">✔ No features locked behind pay wall</Typography></li>
            <li><Typography variant="p">✔ Create unlimited habits</Typography></li>
            <li><Typography variant="p">✔ Access all your analytics</Typography></li>
          </ul>
        </div>
      </div>
    </main>
  );
}
