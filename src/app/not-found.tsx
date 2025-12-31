import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <div className="text-center px-4">
        <h1 className="text-6xl font-bold mb-4">404</h1>
        <p className="text-xl mb-8">Página no encontrada</p>
        <Link 
          href="/" 
          className="inline-block px-6 py-3 bg-white text-black hover:bg-gray-200 transition-colors rounded"
        >
          Volver al inicio
        </Link>
      </div>
    </div>
  )
}
