package com.distritv.di

import org.koin.androidx.viewmodel.dsl.viewModelOf
import org.koin.dsl.module
import com.distritv.imageview.ImageViewModel
import com.distritv.data.FileDbService
import com.distritv.data.FileDbHelper
import org.koin.core.module.dsl.factoryOf

val viewModelsModule = module {
    viewModelOf(::ImageViewModel)
}

val servicesModule = module {
    factoryOf(::FileDbService)
    factoryOf(::FileDbHelper)
}