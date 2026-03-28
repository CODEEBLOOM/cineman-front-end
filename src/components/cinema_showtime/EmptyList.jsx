const EmptyList = ({ content = 'Danh sách lịch chiếu trống' }) => {
  return (
    <div className="flex h-64 flex-col items-center justify-center text-center">
      <div className="animate-bounce text-6xl">🎬</div>
      <p className="mt-4 text-lg font-medium text-gray-600">{content}</p>
    </div>
  );
};

export default EmptyList;