import React, { useEffect, useState } from 'react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from './firebase';
import { format } from 'date-fns';

interface PsychologyPost {
  id: string;
  date: string;
  title: string;
  summary: string;
  imageUrl: string;
}

function App() {
  const [relatedPosts, setRelatedPosts] = useState<PsychologyPost[]>([]);
  const [selectedPost, setSelectedPost] = useState<PsychologyPost | null>(null);
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('darkMode') === 'true';
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('darkMode', darkMode.toString());
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setIsLoading(true);
        const postsRef = collection(db, 'psychology-posts');
        const q = query(postsRef, orderBy('date', 'desc'));
        const querySnapshot = await getDocs(q);
        const posts = querySnapshot.docs.map((doc) => {
          const data = doc.data();
          const formattedDate = data.date ? (data.date.toDate ? format(data.date.toDate(), 'MMM d, yyyy') : data.date) : '';
          return {
            id: doc.id,
            ...data,
            date: formattedDate,
          };
        }) as PsychologyPost[];
        setRelatedPosts(posts);
      } catch (error) {
        console.error('Error fetching posts:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const navLinks = [
    { name: 'Home', href: '#' },
    { name: 'Articles', href: '#articles' },
    { name: 'About', href: '#about' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'dark bg-gray-900' : 'bg-white'}`}>
      {/* Header */}
      <header className="sticky top-0 z-50 bg-red-600 bg-opacity-50 dark:bg-red-800 dark:bg-opacity-50 backdrop-blur-lg shadow-lg transition-colors duration-300">
        <nav className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white dark:bg-gray-800 rounded-full flex justify-center items-center shadow-lg transition-colors duration-300">
                <span className="text-2xl text-red-600 dark:text-red-400">🧠</span>
              </div>
              <h1 className="text-3xl font-bold text-white">Mind Chit</h1>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="text-white hover:text-red-200 transition-colors duration-200"
                >
                  {link.name}
                </a>
              ))}
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="p-2 rounded-full hover:bg-red-700 dark:hover:bg-red-900 transition-colors duration-300"
                aria-label="Toggle dark mode"
              >
                <span className="text-2xl">{darkMode ? '☀️' : '🌙'}</span>
              </button>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-white p-2"
                aria-label="Toggle menu"
              >
                {isMenuOpen ? '✕' : '☰'}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden py-4 animate-fade-in">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="block py-2 text-white hover:text-red-200 transition-colors duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.name}
                </a>
              ))}
              <div className="pt-4 border-t border-red-500">
                <button
                  onClick={() => {
                    setDarkMode(!darkMode);
                    setIsMenuOpen(false);
                  }}
                  className="flex items-center gap-2 text-white hover:text-red-200 transition-colors duration-200"
                >
                  <span>{darkMode ? 'Light Mode ☀️' : 'Dark Mode 🌙'}</span>
                </button>
              </div>
            </div>
          )}
        </nav>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {isLoading ? (
            <div className="flex justify-center items-center min-h-[60vh]">
              <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-red-600"></div>
            </div>
          ) : !selectedPost ? (
            <>
              {/* Default Main Content */}
              <h2 className="text-5xl font-bold text-red-600 dark:text-red-400 mb-8 leading-tight title animate-fade-in">
                STRANGER THINGS WEB SERIES
              </h2>

              {/* Image with hover effect */}
              <div className="mb-8 rounded-2xl overflow-hidden shadow-2xl transform hover:scale-[1.02] transition-transform duration-300">
                <img
                  src="https://ia.tmgrup.com.tr/fd2afa/0/0/0/0/1600/900?u=https://i.tmgrup.com.tr/es/2022/09/15/stranger-things-5-sezon-hakkinda-her-sey-1663231064384.jpg"
                  alt="Stranger Things"
                  className="w-full h-[500px] object-cover"
                  loading="lazy"
                />
              </div>

              {/* Content with enhanced typography */}
              <div className="space-y-6">
                <p className="text-xl leading-relaxed text-gray-800 dark:text-gray-200 animate-fade-in">
                  <span className="font-semibold text-red-600 dark:text-red-400">Stranger Things</span> is a chilling descent into the eerie unknown, where the normalcy of small-town life is shattered by supernatural horrors lurking just beneath the surface. As a group of friends unravels the mysteries surrounding their missing friend, they stumble upon a hidden world—a parallel dimension known as the "Upside Down."
                </p>
                <p className="text-xl leading-relaxed text-gray-800 dark:text-gray-200 animate-fade-in delay-100">
                  A dark, decaying mirror of their own reality, it is filled with nightmarish creatures and a relentless malevolence that creeps into their lives. The tension builds with every flicker of the lights, every whispered warning, as sinister forces manipulate time, space, and minds, leaving viewers on the edge of their seats.
                </p>
                <p className="text-xl leading-relaxed text-gray-800 dark:text-gray-200 animate-fade-in delay-200">
                  The show perfectly captures the dread of the unseen, the terror of isolation, and the unnerving feeling that no one, not even those closest to you, are safe from the horrors that lurk in the shadows.
                </p>

                <div className="pt-4 border-t border-red-200 dark:border-red-800">
                  <p className="text-red-600 dark:text-red-400 font-semibold flex items-center gap-2">
                    <span>Source: ChatGPT, Google</span>
                  </p>
                </div>
              </div>
            </>
          ) : (
            <>
              {/* Selected Post Content with animations */}
              <div className="animate-slide-in">
                <button
                  className="mb-6 px-4 py-2 flex items-center gap-2 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-colors"
                  onClick={() => setSelectedPost(null)}
                >
                  <span className="text-xl">←</span>
                  <span>Back to Main Content</span>
                </button>

                <h2 className="text-5xl font-bold text-red-600 dark:text-red-400 mb-8 leading-tight">
                  {selectedPost.title}
                </h2>

                <div className="mb-8 rounded-2xl overflow-hidden shadow-2xl transform hover:scale-[1.02] transition-transform duration-300">
                  <img
                    src={selectedPost.imageUrl}
                    alt={selectedPost.title}
                    className="w-full h-[500px] object-cover"
                    loading="lazy"
                  />
                </div>

                <div className="space-y-6">
                  <p className="text-xl leading-relaxed text-gray-800 dark:text-gray-200">
                    {selectedPost.summary}
                  </p>

                  <div className="pt-4 border-t border-red-200 dark:border-red-800">
                    <p className="text-red-600 dark:text-red-400 font-semibold flex items-center gap-2">
                      <span>📅</span>
                      <span>Published on: {selectedPost.date}</span>
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Related Posts Section with grid animations */}
          {!selectedPost && (
            <section id="articles" className="mt-16 pt-12 border-t border-red-100 dark:border-red-800">
              <h3 className="text-3xl font-bold text-red-600 dark:text-red-400 mb-8">More Psychology Facts</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {relatedPosts.map((post, index) => (
                  <article
                    key={post.id}
                    className={`group cursor-pointer bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 animate-fade-in`}
                    style={{ animationDelay: `${index * 100}ms` }}
                    onClick={() => setSelectedPost(post)}
                  >
                    <div className="aspect-video overflow-hidden rounded-t-xl">
                      <img
                        src={post.imageUrl}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                    </div>
                    <div className="p-6">
                      <div className="flex items-center text-red-500 dark:text-red-400 text-sm mb-2">
                        <span className="mr-2">📅</span>
                        <span>{post.date}</span>
                      </div>
                      <h4 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2 line-clamp-2">
                        {post.title}
                      </h4>
                      <p className="text-gray-600 dark:text-gray-300 line-clamp-3 mb-4">
                        {post.summary}
                      </p>
                      <div className="flex items-center text-red-600 dark:text-red-400 font-semibold group-hover:gap-2 transition-all duration-300">
                        Read More
                        <span className="ml-1 group-hover:translate-x-1 transition-transform">→</span>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-red-600 dark:bg-red-800 text-white py-12 mt-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h4 className="text-xl font-bold mb-4">About Mind Chit</h4>
              <p className="text-red-100">Exploring the fascinating world of psychology and human behavior through engaging articles and insights.</p>
            </div>
            <div>
              <h4 className="text-xl font-bold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                {navLinks.map((link) => (
                  <li key={link.name}>
                    <a href={link.href} className="text-red-100 hover:text-white transition-colors duration-200">
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-xl font-bold mb-4">Connect</h4>
              <div className="flex space-x-4">
                <a href="#" className="text-2xl hover:text-red-200 transition-colors duration-200">📱</a>
                <a href="#" className="text-2xl hover:text-red-200 transition-colors duration-200">✉️</a>
                <a href="#" className="text-2xl hover:text-red-200 transition-colors duration-200">📸</a>
              </div>
            </div>
            <div>
              <h4 className="text-xl font-bold mb-4">Newsletter</h4>
              <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full px-4 py-2 rounded-lg bg-red-700 dark:bg-red-900 text-white placeholder-red-200 focus:outline-none focus:ring-2 focus:ring-red-400"
                />
                <button className="px-6 py-2 bg-white text-red-600 rounded-lg hover:bg-red-100 transition-colors duration-200">
                  Subscribe
                </button>
              </form>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-red-500 text-center">
            <p className="text-red-100">© {new Date().getFullYear()} Mind Chit. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;