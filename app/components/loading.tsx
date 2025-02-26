const Loading = () => {
    return <div className='flex justify-center items-center h-full'>
        <div className='flex flex-col items-center'>
        <div className='border-4 border-gray-800 border-t-gray-300 animate-spin w-8 h-8 rounded-full'></div>
        <div className='text-white w-max'>Fetching messages</div>
        </div>
    </div>
}

export default Loading