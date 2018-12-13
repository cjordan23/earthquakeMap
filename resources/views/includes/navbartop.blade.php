<nav class="navbar navbar-expand-md navbar-dark bg-dark">
   <a class="navbar-brand brand" href="#">Your Website Logo</a>
   <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarText" aria-controls="navbarText" aria-expanded="false" aria-label="Toggle navigation">
       <span class="navbar-toggler-icon"></span>
   </button>
   <div class="collapse navbar-collapse" id="navbarText">
       <ul class="navbar-nav mr-auto">
           <li class="nav-item">
               
               <a class="nav-link nav-menu-left" href="/dashboard"><div class="oi oi-globe"></div>Dashboard </a>
           </li>
           <li class="nav-item">
               <a class="nav-link nav-menu-left" href="/workflows">Workflows</a>
           </li>
           <li class="nav-item">
               <a class="nav-link nav-menu-left" href="/statistic">Statistic</a>
           </li>
           <li class="nav-item">
               <a class="nav-link nav-menu-left" href="/admin">Admin</a>
           </li>
       </ul>
       <span class="navbar-text">
               <div class="nav-menu-right">
                       <!-- Split dropleft button -->
                       <div class="btn-group">
                           <div class="btn-group dropleft" role="group">
                             <button type="button" class="btn btn-secondary dropdown-toggle dropdown-toggle-split" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                               <span class="sr-only">Toggle Dropleft</span>
                             </button>
                             <div class="dropdown-menu">
                               <!-- Dropdown menu links -->
                                   <a class="dropdown-item" href="#">Action</a>
                                   <a class="dropdown-item" href="#">Another action</a>
                                   <a class="dropdown-item" href="#">Something else here</a>
                                   <div class="dropdown-divider"></div>
                                   <a class="dropdown-item" href="#">Add Your Link Here</a>
                                   <a class="dropdown-item" href="{{ route('logout') }}"
                                   onclick="event.preventDefault();
                                               document.getElementById('logout-form').submit();">
                                   Logout
                                   </a>
                                   <form id="logout-form" action="{{ route('logout') }}" method="POST" style="display: none;">
                                   {{ csrf_field() }}
                                   </form>
                             </div>
                           </div>
                           <button type="button" class="btn btn-secondary">
                               @guest
                                   <a class="nav-menu-right" href="{{ route('login') }}">Login</a>
                                   <a class="nav-menu-right" href="{{ route('register') }}">Register</a>        
                               @else
                               <!-- Tampilkan nama user yg login -->
                                   <a class="username">
                                       {{ Auth::user()->name }}
                                   </a>
                               @endguest
                           </button>
                       </div>
               </div>
       </span>
   </div>
</nav>