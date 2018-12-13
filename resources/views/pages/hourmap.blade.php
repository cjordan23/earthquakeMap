@extends('layouts.layout')

@section('content')
This is All hour map page
<div class="container-fluid">
    <div class="row">
            <div id="map-container-card" class="card">
                  
                <div class="card-body">
                    <div id="map-hour-container"></div>
                </div>
            </div>
    </div>
</div>
@endsection

@push('googleMapScripts')
   <script src="{{ asset('/js/maps/pasthoursmap.js') }}"></script>
@endpush