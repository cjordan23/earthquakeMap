@extends('layouts.layout')

@section('content')
This is Week Map
<div class="container-fluid">
    <div class="row">
            <div id="map-container-card" class="card">
                  
                <div class="card-body">
                    <div id="map-week-container"></div>
                </div>
            </div>
    </div>
</div>
@endsection

@push('googleMapScripts')
   <script src="{{ asset('/js/maps/pastweekmap.js') }}"></script>
@endpush