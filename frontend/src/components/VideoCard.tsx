import { useState } from 'react';
import { motion } from 'motion/react';
import { Pencil, Trash2 } from 'lucide-react';

interface VideoCardProps {
  video: {
    id: string;
    thumbnail: string;
    prompt: string;
    author?: string;
  };
  onClick?: () => void;
  showActions?: boolean;
  onDelete?: () => void;
}

export default function VideoCard({ video, onClick, showActions = false, onDelete }: VideoCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Navigate to edit or open edit modal
    console.log('Edit video:', video.id);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete?.();
  };

  return (
    <motion.div
      className="relative rounded-3xl overflow-hidden cursor-pointer group aspect-video bg-gray-100"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
      whileHover={{ scale: 1.03 }}
      transition={{ duration: 0.3 }}
    >
      {/* Video/Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${video.thumbnail})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
      </div>

      {/* Hover Actions */}
      {showActions && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.2 }}
          className="absolute top-4 right-4 flex gap-2 z-10"
        >
          <button
            onClick={handleEdit}
            className="p-2 bg-white/20 backdrop-blur-md rounded-xl hover:bg-white/30 transition-colors"
          >
            <Pencil className="w-4 h-4 text-white" />
          </button>
          <button
            onClick={handleDelete}
            className="p-2 bg-white/20 backdrop-blur-md rounded-xl hover:bg-red-500/80 transition-colors"
          >
            <Trash2 className="w-4 h-4 text-white" />
          </button>
        </motion.div>
      )}

      {/* Shadow on Hover */}
      <motion.div
        className="absolute inset-0 shadow-2xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      />
    </motion.div>
  );
}