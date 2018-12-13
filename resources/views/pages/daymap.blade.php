@extends('layouts.layout')

@section('content')
<div class="container-fluid">
   <div class="row">
           <div id="map-container-card" class="card">
               <div class="card-body">
                   <div class="text-center">
                       <h2 class="card-title">Earthquake Past Today</h2>
                       <hr></hr>
                   </div>
                   <div id="map-container"></div>
               </div>
           </div>
   </div>
</div>
@endsection

@push('googleMapScripts')
   <script src="{{ asset('/js/maps/googlemap.js') }}"></script>
@endpush